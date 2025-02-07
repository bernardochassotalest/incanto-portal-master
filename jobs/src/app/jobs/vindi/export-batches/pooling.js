import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:vindi:export-batches:pooling');

export default {
    key: 'VindiExportBatchesPooling',
    options: { repeat: { cron: '40,48 * * * *' } },
    async handle({ data, broker }) {
        Queue.add('VindiExportBatches', {});

        log('Ok');
    }
};
