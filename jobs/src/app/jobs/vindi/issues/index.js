import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import Issues from './business'

const log = debug('incanto:vindi:issues');

export default {
    key: 'VindiIssues',
    async handle({ data, broker }) {
        try {
            let executing = _.get(process, 'running_vindi', false);
            if (!executing) {
                process.running_vindi = true;

                let pooling = await postgres.Pooling.getStart('vindi-issues');

                await Issues.process({data: pooling, broker})
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};
