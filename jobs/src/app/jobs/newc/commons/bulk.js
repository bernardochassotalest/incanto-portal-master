import _ from 'lodash'
import moment from 'moment'
import { getContent } from 'app/jobs/newc/commons/utils'
let asyncio = require('async')

const BATCH = 1000;

const parserData = (data) => {
    let content = data,
        count = _.size(content),
        keepDoing = false;

    if (count == BATCH) {
        keepDoing = true;
    }

    return { keepDoing, content }
}

const getData = async (action, options) => {
    let hasContent = true,
        result = [];

    while (hasContent) {
        let data = await getContent(action, options);
        let { keepDoing, content } = parserData(data);
        _.set(options, 'skip', _.get(options, 'skip', 0) + BATCH)
        result = _.concat(result, content)
        hasContent = keepDoing
    }

    return result;
}

const getOptions = (params) => {
    let result = {
            'batch': BATCH,
            'skip': 0
        },
        typePeriod = _.get(params, 'currentPeriod.period_type', 'monthly'),
        currentDate = _.get(params, 'currentPeriod.start_date', moment().tz('America/Sao_Paulo').format('YYYY-MM-DD')),
        currentCycle = _.get(params, 'currentPeriod.start_cycle', '00'),
        startDate = currentDate,
        endDate = currentDate;

    if (typePeriod == 'monthly') {
        startDate = moment(currentDate).startOf('month').format('YYYY-MM-DD');
        endDate = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    }
    if (_.isEmpty(currentCycle) == true) {
        currentCycle = '00';
    }

    _.set(result, 'since', `${startDate} ${currentCycle}:00:00`);
    _.set(result, 'to', `${endDate} 23:59:59`);

    return result;
}

export const BulkClients = async (params) => {
    let options = getOptions(params),
        action = 'BulkClients';

    params[action] = await getData(action, options);

    return params;
}

export const BulkProducts = async (params) => {
    let options = getOptions(params),
        action = 'BulkProducts';

    params[action] = await getData(action, options);

    return params;
}

export const BulkTransactions = async (params) => {
    let options = getOptions(params),
        action = 'BulkTransactions';

    let result = await getData(action, options);
    params[action] = result;
    params['QtyTransaction'] = _.size(result);

    return params;
}

export const BulkBoughtProducts = async (params) => {
    let qtyTransaction = _.get(params, 'QtyTransaction', 0),
        options = getOptions(params),
        action = 'BulkBoughtProducts';

    params[action] = [];
    if (qtyTransaction > 0) {
        params[action] = await getData(action, options);
    }

    return params;
}

export const BulkBoughtProductsPriceComponents = async (params) => {
    let qtyTransaction = _.get(params, 'QtyTransaction', 0),
        options = getOptions(params),
        action = 'BulkBoughtProductsPriceComponets';

    params[action] = [];
    if (qtyTransaction > 0) {
        params[action] = await getData(action, options);
    }

    return params;
}

export const BulkTransactionsPayments = async (params) => {
    let qtyTransaction = _.get(params, 'QtyTransaction', 0),
        options = getOptions(params),
        action = 'BulkTransactionsPayments';

    params[action] = [];
    if (qtyTransaction > 0) {
        var result = await getData(action, options);
        if (_.isEmpty(result) == false) {
            for (var j = 0; j < result.length; j++) {
                let item = result[j],
                    details = _.get(item, 'Details', '');

                if (_.isEmpty(item) == false) {
                    try {
                        details = _.replace(details, /pagador\./ig, 'pagador_') //Enhance de Dados Vindi
                        item['Details'] = JSON.parse(details);
                    } catch (follow) {
                        console.log('TransactionData', item, ' Error: ', follow);
                    }
                }
            }
            params[action] = _.flattenDeep(_.concat(params[action], result));
        }
    }

    return params;
}
