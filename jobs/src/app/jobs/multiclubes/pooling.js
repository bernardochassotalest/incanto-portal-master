import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:multiclubes:pooling');

export default {
    key: 'MulticlubesPooling',
    options: { repeat: { cron: '10,15 * * * *' } },
    async handle({ data, broker }) {
        Queue.add('MulticlubesFinancialLog', {});

        log('Ok');
    }
};
