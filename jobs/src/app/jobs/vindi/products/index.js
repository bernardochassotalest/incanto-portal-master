import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import Products from './business'

const log = debug('incanto:vindi:products');

export default {
    key: 'VindiProducts',
    async handle({ data }) {
        try {
            let executing = _.get(process, 'running_vindi', false);
            if (!executing) {
                process.running_vindi = true;

                let pooling = await postgres.Pooling.getStart('vindi-products');

                await Products.process({data: pooling})
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};