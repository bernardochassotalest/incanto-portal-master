import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import debug from 'debug';
import { sha256 } from 'app/lib/utils'
import newcConfig from 'config/newc';

const log = debug('incanto:newc:commons');


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const getParameters = (parameters) => {
    let options = parameters || {},
        keys = [],
        result = '';

    for (var [key, value] of Object.entries(options)) {
        keys.push(`${key}=${value}`)
    }

    if (_.isEmpty(keys) == false) {
        result = '&' + keys.join('&')
    }

    return result
}

const getData = async (url) => {
    let result = {};

    try {
        log(url)
        const response = await axios.get(url);
        result = response.data;
    } catch (error) {
        result['HttpError'] = error.message;
        if (error.response) {
            result = error.response.data;
        }
        log('NewC Error --> ', error.message);
    }
    return result
};

export const getUrl = (action, options) => {
    const CONFIG = {
        authClientId: process.env.NEWC_CLIENTID,
        secretAPIKey: process.env.NEWC_APIKEY,
        urlAPI: process.env.NEWC_APIURL
    }
    let authDateTime = moment().utc().format('YYYY-MM-DD HH:mm:ss')
    let parameters = getParameters(options)
    let forHash = `authClientId=${CONFIG.authClientId}${parameters}&authDateTime=${authDateTime}`
    let hashed = sha256(forHash + CONFIG.secretAPIKey)
    let query = `${forHash}&authHash=${hashed}`

    return `${CONFIG.urlAPI}${action}?${query}`
}

export const getContent = async (action, options) => {
    return await getData(getUrl(action, options));
}

const getPeriod = (entity, type, date, cycle) => {
    let result = {
            'entity': entity,
            'period_type': type,
            'start_date': date
        };

    if (_.isEmpty(cycle) == false) {
        result['start_cycle'] = cycle;
    }

    return result;
}

export const getPeriods = (entity, startPeriod) => {
    const startCycle = _.get(startPeriod, 'startCycle', '');
    let actualDate = moment(_.get(startPeriod, 'startDate', '')).startOf('day'),
        periodType = _.get(startPeriod, 'periodType', 'monthly'),
        period = [];

    if (periodType == 'daily') {
        let qtyDays = moment().startOf('day').diff(actualDate, 'days') + 1;
        if (qtyDays == 1) {
            period.push(getPeriod(entity, periodType, actualDate.format('YYYY-MM-DD'), startCycle));
        } else {
            period.push(getPeriod(entity, periodType, actualDate.format('YYYY-MM-DD')));
        }
        for (let i = 1; i < qtyDays; i++) {
            period.push(getPeriod(entity, periodType, actualDate.add(1, 'days').format('YYYY-MM-DD')));
        }
    } else if (periodType == 'monthly') {
        let qtyMonths = moment().diff(actualDate, 'months') + 1;
        period.push(getPeriod(entity, periodType, actualDate.format('YYYY-MM-DD')));
        for (let i = 1; i < qtyMonths; i++) {
            period.push(getPeriod(entity, periodType, actualDate.add(1, 'months').format('YYYY-MM-DD')));
        }
    }

    if ((entity == 'transactions') && (newcConfig.matchTest != 'NONE')) {
      period = [];
      let dates = _.split(newcConfig.matchTest, '|');
      for (let i = 0; i < dates.length; i++) {
        period.push(getPeriod(entity, periodType, dates[i]));
      }
    }

    return period;
}
