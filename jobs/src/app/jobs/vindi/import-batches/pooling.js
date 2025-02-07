import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:vindi:import-batches:pooling');

export default {
    key: 'VindiImportBatchesPooling',
    options: { repeat: { cron: '10,20,30,40,50 * * * *' } },
    async handle({ data, broker }) {
        Queue.add('VindiImportBatches', {});

        log('Ok');
    }
};
