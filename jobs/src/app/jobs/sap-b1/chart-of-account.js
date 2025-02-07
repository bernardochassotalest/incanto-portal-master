import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:sapb1:chartofaccount');

export default {
    key: 'SapB1ChartOfAccount',
    async handle({ data, broker }) {
        let pooling = await postgres.Pooling.getStart('sapb1-chart-of-account');

        publishSapB1(broker, 'ChartOfAccount', 'Get', { 'StartDate': _.get(pooling, 'startDate', '') });

        await postgres.Pooling.saveStart('sapb1-chart-of-account');

        log('Ok');
    }
};