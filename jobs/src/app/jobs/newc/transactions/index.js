import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import Transactions from './business'

const log = debug('incanto:newc:transactions');

export default {
    key: 'NewcTransactions',
    async handle({ data, broker }) {
        try {
            let executing = _.get(process, 'running_newc', false);
            if (!executing) {
                process.running_newc = true;

                let pooling = await postgres.Pooling.getStart('newc-transactions');

                await Transactions.process({data: pooling, broker})
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};
