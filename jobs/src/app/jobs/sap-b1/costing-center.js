import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:sapb1:costingcenter');

export default {
    key: 'SapB1CostingCenter',
    async handle({ data, broker }) {
        let pooling = await postgres.Pooling.getStart('sapb1-costing-center');

        publishSapB1(broker, 'ProfitCenter', 'Get', { 'StartDate': _.get(pooling, 'startDate', '') });

        await postgres.Pooling.saveStart('sapb1-costing-center');

        log('Ok');
    }
};