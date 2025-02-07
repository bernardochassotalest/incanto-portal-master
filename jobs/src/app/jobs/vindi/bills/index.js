import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import Bills from './business'

const log = debug('incanto:vindi:bills');

export default {
    key: 'VindiBills',
    async handle({ data, broker }) {
        try {
            let executing = _.get(process, 'running_vindi', false);
            if (!executing) {
                process.running_vindi = true;

                let pooling = await postgres.Pooling.getStart('vindi-bills');

                await Bills.process({data: pooling, broker})
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};
