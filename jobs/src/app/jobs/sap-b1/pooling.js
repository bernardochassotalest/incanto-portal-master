import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';
import { delay } from 'app/lib/utils'

const log = debug('incanto:sapb1:pooling');

export default {
    key: 'SapB1Pooling',
    options: { repeat: { cron: '00,30 * * * *' } },
    async handle({ data, broker }) {
        Queue.add('SapB1CostingCenter', {}); await delay(500);
        Queue.add('SapB1Project', {}); await delay(500);
        Queue.add('SapB1ChartOfAccount', {}); await delay(500);
        Queue.add('SapB1BusinessPartner', {}); await delay(500);
        Queue.add('SapB1JournalEntry', {});

        log('Ok');
    }
};
