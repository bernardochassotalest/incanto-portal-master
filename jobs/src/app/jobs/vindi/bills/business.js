import _ from 'lodash'
import { mongodb, postgres } from 'app/models';
import debug from 'debug';
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { md5, leftString, getTimeLog } from 'app/lib/utils';
import { getDataFromAPI, getDataFromURL } from 'app/jobs/vindi/commons/utils'
import { getCustomerId, getCustomer } from 'app/jobs/skill/commons/utils'
import { enhanceBill } from 'app/jobs/vindi/commons/enhance'
import Customers from 'app/jobs/vindi/customers/business'

const log = debug('incanto:vindi:bills');

const workerQueue = libAsync.queue(({ data, broker }, done) => {
  log(`Vindi - Bills - processing init`);

  handleApi(data, broker)
    .then((result) => {
      log(`Vindi - Bills - processing done - result: ${result}`);
      done();
    })
}, 1);

const saveMongo = async (item, enhance) => {
    let id = _.toString(_.get(item, 'id', '')),
        filter = { '_id': id };
    let record = mongodb.sales_vindi_bills.findOne(filter)
    if (!record) {
        let model = { '_id': id, 'content': item, 'enhance': enhance, 'history': [item] },
            instance = new mongodb.sales_vindi_bills(model);
        await instance.save()
    } else {
        let update = { $push: { history: item }, $set: { content: item, enhance: enhance } },
            options = { upsert: true };
        await mongodb.sales_vindi_bills.findOneAndUpdate(filter, update, options);
    }
}

const savePostgresCharges = async (charges, sale, transaction) => {
    let billId = _.get(sale, 'sourceId', ''),
        issued = _.get(sale, 'refDate', ''),
        saleId = _.get(sale, 'id', ''),
        chargeAmount = 0;

    for (let i = 0; i < charges.length; i++) {
        let charge = charges[i],
            status = _.get(charge, 'status', ''),
            stsContent = (_.includes(['pending', 'paid', 'canceled'], status) === false ? 'pending' : status),
            model = {
                id: _.toString(_.get(charge, 'id', '')),
                billId: billId,
                status: status,
                issuedDate: issued,
                createDate: leftString(_.get(charge, 'created_at', ''), 10),
                dueDate: leftString(_.get(charge, 'due_at', ''), 10),
                paidDate: leftString(_.get(charge, 'paid_at', ''), 10),
                paymentMethod: _.get(charge, 'payment_method.code', ''),
                amount: _.get(charge, 'amount', ''),
            },
            content = {
                sourceName: 'vindi',
                sourceDb: 'c_sales_vindi_bills',
                sourceId: billId,
                saleId: saleId,
                tag: 'avanti',
                refDate: model.createDate,
                taxDate: issued,
                dueDate: model.dueDate,
                status: stsContent,
                type: 'none',
                isConcilied: false,
                timeLog: getTimeLog()
            };

        model['content'] = JSON.stringify(content);
        chargeAmount += model.amount;

        await postgres.VindiCharges.upsert(model, { transaction });
    }

    let creditAmount = _.round((_.get(sale, 'amount', 0) - chargeAmount), 2);
    if (creditAmount > 0) {
      await postgres.Sales.update({isCredit: 'true'}, {where: { id: saleId }, transaction});
    }
}

const savePostgresItems = async (lines,  source, customer, transaction) => {
    let id = source.sourceId;
    for (let i = 0; i < lines.length; i++) {
        let billItem = lines[i],
            itemId = _.toString(_.get(billItem, 'id', '')),
            saleItem = {
                id: md5(`vindi-${id}-${itemId}`),
                itemCode: _.toString(_.get(billItem, 'product.id', '')),
                itemName: _.get(billItem, 'product.name', ''),
                quantity: _.get(billItem, 'quantity', 1) || 1,
                unitPrice: _.get(billItem, 'amount', 0),
                discAmount: 0,
                totalAmount: _.get(billItem, 'amount', 0),
                ownerId: _.get(customer, 'code', ''),
                ownerVatNo: _.get(customer, 'vatNumber', ''),
                ownerName: _.get(customer, 'name', ''),
                ...source
            };
        saleItem['sourceId'] = itemId;
        await postgres.SaleItems.upsert(saleItem, { transaction });
    }
}

const savePostgres = async (item, enhance, broker) => {
    let lines = _.get(item, 'bill_items', []),
        charges = _.get(item, 'charges', []),
        id = _.toString(_.get(item, 'id', '')),
        saleId = md5(`vindi-${id}`);

    const transaction = await postgres.Sales.sequelize.transaction();

    try {
        let billCustId = _.get(item, 'customer.id', ''),
            customerId = await getCustomerId('sales_vindi_customers', billCustId, transaction);
        if (_.isEmpty(customerId) == true) {
            await Customers.getOne(billCustId, broker);
            customerId = await getCustomerId('sales_vindi_customers', billCustId, transaction);
        }
        let source = {
                saleId: saleId,
                sourceName: 'vindi',
                sourceDb: 'sales_vindi_bills',
                sourceId: id,
            },
            sale = {
                id: saleId,
                customerId: customerId,
                refDate: _.get(enhance, 'dates.issued', ''),
                taxDate: _.get(enhance, 'dates.issued', ''),
                dueDate: _.get(enhance, 'dates.due', ''),
                cancelDate: _.get(enhance, 'dates.canceled', ''),
                amount: _.get(enhance, 'items_amount', 0),
                status: _.get(item, 'status', ''),
                tag: 'avanti',
                startPeriod: leftString(_.get(item, 'period.start_at', ''), 10),
                endPeriod: leftString(_.get(item, 'period.end_at', ''), 10),
                isCaptured: 'none',
                isPecld: 'none',
                isCredit: 'none',
                ...source
            },
            customer = await getCustomer(customerId, transaction), where = { id: saleId },
            found = await postgres.Sales.findOne({where, transaction});
        customer['code'] = _.toString(_.get(item, 'customer.id', ''));
        if (found) {
          let updSale = {
            status: _.get(item, 'status', ''),
            cancelDate: _.get(enhance, 'dates.canceled', ''),
            startPeriod: leftString(_.get(item, 'period.start_at', ''), 10),
            endPeriod: leftString(_.get(item, 'period.end_at', ''), 10)
          };
          await postgres.Sales.update(updSale, {where, transaction});
        } else {
          await postgres.Sales.upsert(sale, { transaction });
        }
        await savePostgresItems(lines, source, customer, transaction);
        await savePostgresCharges(charges, sale, transaction);

        await transaction.commit();
    } catch(err) {
        await transaction.rollback(); log(`Error: ${err}`);
    }
}

const handleData = async (data, broker) => {
    for (var i = 0; i < data.length; i++) {
        let item = data[i],
            enhance = await enhanceBill(item);
        item['timeLog'] = getTimeLog();
        await saveMongo(item, enhance);
        await savePostgres(item, enhance, broker);
    }
}

const handleApi = async (pooling, broker) => {
    log(`Starting Pooling`);

    try {
        const ok = await getDataFromAPI('bills', pooling, handleData, broker);
        if (ok) {
          await postgres.Pooling.saveStart('vindi-bills');

          Queue.add('VindiTransactions', {});
        }

        process.running_vindi = false;
    } catch(err) {
        log(`Error while process bills: ${err}`)
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
