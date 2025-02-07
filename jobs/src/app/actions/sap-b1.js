import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';
import { delay } from 'app/lib/utils'

const log = debug('incanto:sap-b1:actions');

export default {
    pooling: async (request, response) => {
        try {
            Queue.add('SapB1CostingCenter', {}); await delay(500);
            Queue.add('SapB1Project', {}); await delay(500);
            Queue.add('SapB1ChartOfAccount', {}); await delay(500);
            Queue.add('SapB1BusinessPartner', {}); await delay(500);
            Queue.add('SapB1JournalEntry', {});

            response.json({error: false, message: 'Pooling started.'})
        } catch(err) {
            log(`Error: ${err}`);
            response.json({ error: true,  message : err })
        }
    }
}
