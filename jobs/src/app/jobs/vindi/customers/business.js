import _ from 'lodash'
import debug from 'debug';
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { md5, delay } from 'app/lib/utils';
import { mongodb, postgres } from 'app/models';
import { onlyNumbers } from 'app/lib/helper';
import { getDataFromAPI, getDataFromURL } from 'app/jobs/vindi/commons/utils';

const log = debug('incanto:vindi:customers');

const workerQueue = libAsync.queue(({ data, broker }, done) => {
  log(`Vindi - Customers - processing init`);

  handleApi(data, broker)
    .then((result) => {
      log(`Vindi - Customers - processing done - result: ${result}`);
      done();
    })
}, 1);

const parserCustomer = (data) => {
    let code = _.toString(_.get(data, 'id', '')),
        vatNumber = onlyNumbers(_.get(data, 'registry_code', ''));
    if (_.isEmpty(vatNumber)) {
        vatNumber = `vindi-${code}`;
    }
    return {
        content: {
            'id': '',
            'name': _.get(data, 'name', ''),
            'vatNumber': vatNumber,
            'email': _.get(data, 'email', ''),
            'phone': _.get(_.first(_.get(data, 'phones', [])), 'number', ''),
            'birthDate': '',
            'street': _.get(data, 'address.street', ''),
            'streetNo': _.get(data, 'address.number', ''),
            'complement': _.get(data, 'address.additional_details', ''),
            'neighborhood': _.get(data, 'address.neighborhood', ''),
            'zipCode': _.get(data, 'address.zipcode', ''),
            'city': _.get(data, 'address.city', ''),
            'state': _.get(data, 'address.state', ''),
            'country': _.get(data, 'address.country', ''),
        },
        reference: {
            'id': md5(`vindi-${code}`),
            'customerId': '',
            'sourceName': 'vindi',
            'sourceDb': 'sales_vindi_customers',
            'sourceId': code,
        }
    };
}

const saveData = async (data, broker, extra) => {
  let method = (_.get(extra, 'one') == true ? 'One' : 'Post');
  for (var i = 0; i < data.length; i++) {
      let item = data[i],
          id = String(_.get(item, 'id', '')),
          filter = { '_id': id },
          model = { '_id': id, 'content': item };

      await mongodb.sales_vindi_customers.upsert(filter, model);
      await broker.publish(`incanto.Skill.Customers.${method}`, parserCustomer(item));
  }
}

const handleOne = async (customerId, broker) => {
    try {
        await getDataFromURL('customers', `?query=id=${customerId}`, saveData, broker, { one: true });
        await delay(1500);
    } catch(err) {
        log(`Error while process customers: ${err}`)
        return false;
    }
    return true;
}

const handleApi = async (pooling, broker) => {
    log(`Starting Pooling`);

    try {
        const ok = await getDataFromAPI('customers', pooling, saveData, broker);
        if (ok) {
          await postgres.Pooling.saveStart('vindi-customers');

          Queue.add('VindiBills', {});
        }

        process.running_vindi = false;
    } catch(err) {
        log(`Error while process customers: ${err}`)
        process.running_vindi = false;
        return false;
    }
    return true;
};

export default {
    process({ data, broker }) {
      workerQueue.push({ data, broker })
    },
    async getOne(customerId, broker) {
      return await handleOne(customerId, broker);
    }
};
