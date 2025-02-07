import _ from 'lodash'
import debug from 'debug';
import moment from 'moment'
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { leftString } from 'app/lib/utils'
import { mongodb, postgres } from 'app/models';
import { getPeriods } from 'app/jobs/newc/commons/utils'
import { BulkProducts } from 'app/jobs/newc/commons/bulk'
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:newc:products');
let localBroker = null;

const workerQueue = libAsync.queue(({ data }, done) => {
  log(`NewC - Products - processing init`);

  handleApi(data)
    .then((result) => {
      log(`NewC - Products - processing done - result: ${result}`);
      done();
    })
}, 1);

const SaveChampionshipMatch = async (model) => {
  const transaction = await postgres.Matches.sequelize.transaction();

  try {
    let tournament = _.get(model, 'Tournament', ''),
        championship = { 'id': '', 'name': '' },
        opponent = '';

    if (_.isEmpty(tournament) == false) {
        let parsed = _.split(tournament, '|');
        if (_.size(parsed) > 1) {
            let tournamentId = 'NEWC-' + _.padStart(_.trim(parsed[0]), 3, '0');

            championship = { 'id': tournamentId, 'name': _.trim(parsed[1]) };

            await postgres.Championships.upsert(championship, { transaction });

            publishSapB1(localBroker, 'Championship', 'Post', { Code: championship.id, Name: championship.name });
        }
    }

    let productName = _.get(model, 'Name', ''),
        parseOpponent = _.split(productName, ' x ');
    if (_.isEmpty(parseOpponent) == false) {
        if (_.size(parseOpponent) > 1) {
            opponent = _.last(parseOpponent);
        }
    }

    let productDate = moment(_.get(model, 'StartDate', '')),
        date = productDate.format('YYYY-MM-DD'),
        time = productDate.format('HH:mm'),
        baseId = _.padStart(_.trim(_.get(model, 'ProductId', '')), 7, '0'),
        productId = `NEWC-${baseId}`,
        match = {
            'id': productId,
            'name': productName,
            'date': date,
            'time': time,
            'opponent': opponent,
            'championshipId': championship.id
        };

    await postgres.Matches.upsert(match, { transaction });

    let sapMatch = { Code: match.id, Name: match.name, Date: match.date, Time: match.time, Opponent: match.opponent }
    sapMatch['Championship'] = { Code: match.championshipId };
    publishSapB1(localBroker, 'Match', 'Post', sapMatch);

    await transaction.commit();
  } catch(err) {
    await transaction.rollback();
    log(`Error: ${err}`);
  }
}

const SaveBulkProducts = async (params) => {
  try {
    const { BulkProducts } = params;

    for (let i = 0; i < BulkProducts.length; i++) {
      let item = BulkProducts[i],
          productType = _.toUpper(_.trim(_.get(item, 'ProductType', ''))),
          id = String(_.get(item, 'ProductId', '')),
          filter = { '_id': id },
          model = { '_id': id };

      model = _.merge(model, item);
      await mongodb.sales_newc_products.upsert(filter, model);
      if (productType == 'MATCH') {
          await SaveChampionshipMatch(model);
      }
    }
  } catch (error) {
    throw error;
  }

  return params;
}

const processData = async (currentPeriod) => {
  try {
    let params = { currentPeriod };

    await BulkProducts(params);
    await SaveBulkProducts(params);
  } catch (error) {
    throw error;
  }
}

const handleApi = async (pooling) => {
  try {
    let periods = getPeriods('products', pooling);

    for (let i = 0; i < periods.length; i++) {
      await processData(periods[i]);
    }

    await postgres.Pooling.saveStart('newc-products', 'daily');

    process.running_newc = false;

    Queue.add('NewcClients', {});
  } catch(err) {
    log(`Error while process products: ${err}`)
    process.running_newc = false;
    return false;
  }
  return true;
};

export default {
  process({ data, broker }) {
    localBroker = broker;

    workerQueue.push({ data })
  }
};
