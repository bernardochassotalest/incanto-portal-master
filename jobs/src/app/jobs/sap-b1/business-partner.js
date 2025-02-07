import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:sapb1:businesspartner');

export default {
    key: 'SapB1BusinessPartner',
    async handle({ data, broker }) {
        let pooling = await postgres.Pooling.getStart('sapb1-business-partners');

        publishSapB1(broker, 'BusinessPartner', 'Get', { 'StartDate': _.get(pooling, 'startDate', '') });

        await postgres.Pooling.saveStart('sapb1-business-partners');

        log('Ok');
    }
};