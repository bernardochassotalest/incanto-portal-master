import _ from 'lodash'
import debug from 'debug';
import moment from 'moment'
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { mongodb, postgres } from 'app/models';
import { md5, getTimeLog } from 'app/lib/utils';
import { isCpfValid, isCnpjValid } from 'app/lib/validator';
import { onlyNumbers } from 'app/lib/helper';
import { getPeriods } from 'app/jobs/newc/commons/utils'
import { BulkClients } from 'app/jobs/newc/commons/bulk'
import { globalCustomer } from 'app/jobs/skill/commons/utils';
import { getDescriptionByCode } from 'app/jobs/newc/commons/tables'

const log = debug('incanto:newc:clients');

const workerQueue = libAsync.queue(({ data, broker }, done) => {
  log(`NewC - Clients - processing init`);

  handleApi(data, broker)
    .then((result) => {
      log(`NewC - Clients - processing done - result: ${result}`);
      done();
    })
}, 1);

const parserCustomer = (data) => {
    let code = _.toString(_.get(data, 'UserId', '')),
        vatNumber = onlyNumbers(_.get(data, 'Identifier', '')),
        firstName = _.get(data, 'FirstName') || '',
        lastName = _.get(data, 'LastName') || '',
        businessAccount = _.get(data, 'BusinessAccount') || false,
        cardCode = '';

    if (businessAccount == true) {
      vatNumber = onlyNumbers(_.get(data, 'VatNumber', ''));
      firstName = _.get(data, 'Identifier', '');
      lastName = '';
      cardCode = _.get(data, 'ContractNumber', '');
    }

    if (isCpfValid(vatNumber) == false) {
      if (isCnpjValid(vatNumber) == false) {
        return null;
      }
    }
    return {
        content: {
            'id': '',
            'name': _.trim(`${firstName} ${lastName}`),
            'vatNumber': vatNumber,
            'email': _.get(data, 'Email') || '',
            'phone': _.get(data, 'PhoneNumber') || '',
            'birthDate': _.get(data, 'DOB') || '',
            'street': _.get(data, 'Street') || '',
            'streetNo': _.get(data, 'Address2') || '',
            'complement': _.get(data, 'Address3') || '',
            'neighborhood': _.get(data, 'Neighborhood') || '',
            'zipCode': _.get(data, 'Postcode') || '',
            'city': _.get(data, 'City') || '',
            'state': _.get(data, 'State') || '',
            'country': _.get(data, 'Country') || '',
        },
        reference: {
            'id': md5(`newc-${code}`),
            'customerId': '',
            'sourceName': 'newc',
            'sourceDb': 'sales_newc_clients',
            'sourceId': code,
        }
    };
}

const SaveBulkClients = async (params, broker) => {
  try {
    const BulkClients = params.BulkClients;
    let lastStage = 0;

    for (let i = 0; i < BulkClients.length; i++) {
      let item = BulkClients[i],
          id = String(_.get(item, 'UserId', '')),
          role = _.get(item, 'RoleId', ''),
          filter = { '_id': id },
          model = { '_id': id },
          stage = _.round(i / BulkClients.length * 100),
          parsed = parserCustomer(item);

      item['Role'] = {'Code': role, 'Name': getDescriptionByCode('clients_role', role)};
      model = _.merge(model, item);
      await mongodb.sales_newc_clients.upsert(filter, model);
      if (_.isEmpty(parsed) == false) {
        await broker.publish('incanto.Skill.Customers.Post', parsed);
      }
      if ((stage % 10 === 0)  && (stage > lastStage)) {
        log(`${getTimeLog()} - Content Processed: ${stage}%  Actual: ${i} Last: ${BulkClients.length}`)
        lastStage = stage;
      }
    }
  } catch (error) {
    throw error;
  }

  return params;
}

const processData = async (currentPeriod, broker) => {
  try {
    let params = { currentPeriod };

    await BulkClients(params);
    await SaveBulkClients(params, broker);
  } catch (error) {
    throw error;
  }
}

const handleApi = async (pooling, broker) => {
  try {
    let periods = getPeriods('clients', pooling),
      currentDate = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD');

    for (let i = 0; i < periods.length; i++) {
      let item = periods[i];
      if (_.get(item, 'start_date', '') != currentDate) {
        let parsed = _.cloneDeep(item);
        parsed['entity'] = `newc-${parsed['entity']}`;
        await postgres.Pooling.savePeriod(parsed);
      }
      await processData(item, broker);
    }

    await postgres.Pooling.saveStart('newc-clients', 'daily');

    process.running_newc = false;

    Queue.add('NewcTransactions', {});
  } catch(err) {
    log(`Error while process clients: ${err}`)
    process.running_newc = false;
    return false;
  }
  return true;
};

export default {
    process({ data, broker }) {
        workerQueue.push({ data, broker })
    }
};
