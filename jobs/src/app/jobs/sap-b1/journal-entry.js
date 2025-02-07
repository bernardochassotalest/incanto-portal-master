import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:sapb1:journalentry');

export default {
    key: 'SapB1JournalEntry',
    async handle({ data, broker }) {
        let pooling = await postgres.Pooling.getStart('sapb1-journal-entry');

        publishSapB1(broker, 'JournalEntry', 'Get', { 'StartDate': _.get(pooling, 'startDate', '') });

        await postgres.Pooling.saveStart('sapb1-journal-entry');

        log('Ok');
    }
};
