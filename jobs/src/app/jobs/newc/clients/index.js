import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import Clients from './business'

const log = debug('incanto:newc:clients');

export default {
    key: 'NewcClients',
    async handle({ data, broker }) {
        try {
            let executing = _.get(process, 'running_newc', false);
            if (!executing) {
                process.running_newc = true;

                let pooling = await postgres.Pooling.getStart('newc-clients');

                await Clients.process({data: pooling, broker})
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};
