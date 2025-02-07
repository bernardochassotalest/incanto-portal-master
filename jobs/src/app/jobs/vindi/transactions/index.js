import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import Transactions from './business'

const log = debug('incanto:vindi:transactions');

export default {
    key: 'VindiTransactions',
    async handle({ data, broker }) {
        try {
            let executing = _.get(process, 'running_vindi', false);
            if (!executing) {
                process.running_vindi = true;

                let pooling = await postgres.Pooling.getStart('vindi-transactions');

                await Transactions.process({data: pooling, broker})
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};