import _ from 'lodash'
import debug from 'debug';
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { md5, leftString, getTimeLog } from 'app/lib/utils';
import { mongodb, postgres } from 'app/models';
import { getDataFromAPI } from 'app/jobs/vindi/commons/utils'
import { enhanceIssue } from 'app/jobs/vindi/commons/enhance'
import { getCustomerId, getCustomer } from 'app/jobs/skill/commons/utils'
import Customers from 'app/jobs/vindi/customers/business'

const log = debug('incanto:vindi:issues');

const workerQueue = libAsync.queue(({ data, broker }, done) => {
  log(`Vindi - Issues - processing init`);

  handleApi(data, broker)
    .then((result) => {
      log(`Vindi - Issues - processing done - result: ${result}`);
      done();
    })
}, 1);

const savePostgres = async (data, broker) => {
    const transaction = await postgres.VindiIssues.sequelize.transaction();

    try {
        let issueCustId = _.get(data, 'customer.id', ''),
            customerId = await getCustomerId('sales_vindi_customers', issueCustId, transaction);
        if (_.isEmpty(customerId) == true) {
            await Customers.getOne(issueCustId, broker);
            customerId = await getCustomerId('sales_vindi_customers', issueCustId, transaction);
        }

        let issueId = _.toString(_.get(data, 'id', '')),
            createDate = leftString(_.get(data, 'created_at', ''), 10),
            modelI = {
                id: issueId,
                createDate: createDate,
                issueType: _.get(data, 'issue_type', ''),
                status: _.get(data, 'status', ''),
                itemType: _.get(data, 'item_type', ''),
                itemId: _.get(data, 'item_id', ''),
                expectedAmount: _.get(data, 'data.expected_amount', ''),
                transactionAmount: _.get(data, 'data.transaction_amount', ''),
                customerId: customerId,
                customerKey: _.toString(_.get(data, 'customer.id', '')),
                customerName: _.get(data, 'customer.name', ''),
                customerEmail: _.get(data, 'customer.email', ''),
                customerCode: _.get(data, 'customer.code', ''),
            },
            modelC = {
              id: md5(`${issueId}`),
              customerId: customerId,
              tag: 'avanti',
              date: createDate,
              amount: modelI.transactionAmount,
              balance: modelI.transactionAmount,
              sourceName: 'vindi',
              sourceDb: 'vindiIssues',
              sourceId: issueId,
              isActive: 'true'
            };

        await postgres.VindiIssues.upsert(modelI, { transaction });
        await postgres.CustomerCredits.upsert(modelC, { transaction });

        await transaction.commit();
    } catch(err) {
        await transaction.rollback(); log(`Error: ${err}`);
    }
}

const handleData = async (data, broker) => {
    for (var i = 0; i < data.length; i++) {
        let item = data[i],
            id = String(_.get(item, 'id', '')),
            filter = { '_id': id },
            model = { '_id': id, 'content': item },
            enhance = await enhanceIssue(item);;

        item['timeLog'] = getTimeLog();
        let record = mongodb.sales_vindi_issues.findOne(filter)
        if (!record) {
            let model = { '_id': id, 'content': item, 'enhance': enhance, 'history': [item] },
                instance = new mongodb.sales_vindi_issues(model);
            await instance.save()
        } else {
            let update = { $push: { history: item }, $set: { content: item, enhance: enhance } },
                options = { upsert: true };
            await mongodb.sales_vindi_issues.findOneAndUpdate(filter, update, options);
        }
        await savePostgres(item, broker);
    }
}

const handleApi = async (pooling, broker) => {
    log(`Starting Pooling`);

    try {
        const ok = await getDataFromAPI('issues', pooling, handleData, broker);
        if (ok) {
          await postgres.Pooling.saveStart('vindi-issues');

          Queue.add('VindiPayments', {});
        }

        process.running_vindi = false;
    } catch(err) {
        log(`Error while process issues: ${err}`)
        process.running_vindi = false;
        return false;
    }
    return true;
};

export default {
    process({ data, broker }) {
      workerQueue.push({ data, broker })
    }
};
