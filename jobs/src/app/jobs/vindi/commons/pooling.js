import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:vindi:pooling');

export default {
    key: 'VindiPooling',
    options: { repeat: { cron: '05 * * * *' } },
    async handle({ data, broker }) {

        Queue.add('VindiProducts', {});

        log('Ok');
    }
};
