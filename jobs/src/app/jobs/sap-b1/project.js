import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:sapb1:project');

export default {
    key: 'SapB1Project',
    async handle({ data, broker }) {
        let pooling = await postgres.Pooling.getStart('sapb1-projects');

        publishSapB1(broker, 'Project', 'Get', { 'StartDate': _.get(pooling, 'startDate', '') });

        await postgres.Pooling.saveStart('sapb1-projects');

        log('Ok');
    }
};