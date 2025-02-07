import _ from 'lodash'
import debug from 'debug';
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { mongodb, postgres } from 'app/models';
import { getDataFromAPI } from 'app/jobs/vindi/commons/utils'

const log = debug('incanto:vindi:products');

const workerQueue = libAsync.queue(({ data }, done) => {
  log(`Vindi - Products - processing init`);

  handleApi(data)
    .then((result) => {
      log(`Vindi - Products - processing done - result: ${result}`);
      done();
    })
}, 1);

const savePostgres = async (item, enhance) => {
    const transaction = await postgres.SourceMapping.sequelize.transaction();

    try {
      let where = { source: 'vindi', id: _.toString(_.get(item, 'id', '')) },
        found = await postgres.SourceMapping.findOne({ where, transaction });

      if (!found) {
        let model = {
          source: 'vindi',
          id: _.toString(_.get(item, 'id', '')),
          name: _.get(item, 'name', '')
        }
        await postgres.SourceMapping.upsert(model, { transaction });
      }
      await transaction.commit();
    } catch(err) {
        await transaction.rollback(); log(`Error: ${err}`);
    }
}

const saveData = async (data) => {
    for (var i = 0; i < data.length; i++) {
        let item = data[i],
            id = String(_.get(item, 'id', '')),
            filter = { '_id': id },
            model = { '_id': id, 'content': item };

        await mongodb.sales_vindi_products.upsert(filter, model);
        await savePostgres(item);
    }
}

const handleApi = async (pooling) => {
    log(`Starting Pooling`);

    try {
        const ok = await getDataFromAPI('products', pooling, saveData);
        if (ok) {
          await postgres.Pooling.saveStart('vindi-products');

          Queue.add('VindiCustomers', {});
        }

        process.running_vindi = false;
    } catch(err) {
        log(`Error while process products: ${err}`)
        process.running_vindi = false;
        return false;
    }

    return true;
};

export default {
    process({ data }) {
        workerQueue.push({ data })
    }
};
