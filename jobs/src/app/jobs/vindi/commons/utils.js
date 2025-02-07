import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import debug from 'debug';
import vindiConfig from 'config/vindi';
import { postgres } from 'app/models';
import { parseLinkHeader } from 'app/lib/utils'

const log = debug('incanto:vindi:commons');

const getData = async (url) => {
    let result = { 'link': '' },
        options = { auth: vindiConfig.auth };

    try {
        log(`Getting data from: ${url}`)
        const response = await axios.get(url, options);
        let link = _.get(response, 'headers.link', '')
        if (_.isEmpty(link) == false) {
            result['link'] = parseLinkHeader(link)
        }
        result['data'] = response.data;
        result['error'] = false;
    } catch (error) {
        result['error'] = true;
        result['HttpError'] = error.message;
        if (error.response) {
            result['HttpError'] = error.response.data;
        }
        log(`Vindi - Error: ${error.message}`);
    }
    return result
};

const getUrl = (entity, startDate, startCycle) => {
    let { url, updatedUntil } = vindiConfig,
        currentDate = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        result = `${url}${entity}?page=1&per_page=50`

    if (_.isEmpty(startDate) == false) {
        if ((_.isEmpty(startCycle) == false) && (startDate == currentDate)) {
            result += `&query=updated_at>="${startDate} ${startCycle}:00:00"`
        } else {
            result += `&query=updated_at>=${startDate}`
        }
        if (_.isEmpty(updatedUntil) == false) {
            result += ` AND updated_at<="${updatedUntil}"`
        }
    }

    return result;
}

const getContentByUrl = async (url) => {
    return await getData(url);
}

const getContentByEntity = async (entity, startDate, startCycle) => {
    return await getData(getUrl(entity, startDate, startCycle));
}

const setEnhance = (data) => {
    let enhance = JSON.stringify(data);
    enhance = _.replace(enhance, /pagador\./ig, 'pagador_');
    return JSON.parse(enhance);
}

export const getDataFromAPI = async (entity, pooling, handleData, broker) => {
    let hasContent = true, content = {},
        lastUrl = _.get(pooling, 'lastUrl', ''),
        startDate = _.get(pooling, 'startDate', ''),
        startCycle = _.get(pooling, 'startCycle', '');

    if (_.isEmpty(lastUrl) == false) {
      content = await getContentByUrl(lastUrl);
    } else {
      content = await getContentByEntity(entity, startDate, startCycle);
    }
    var link = _.get(content, 'link', {}),
        data = _.get(content, 'data.' + entity, []),
        next = _.get(link, 'next', ''),
        result = !_.get(content, 'error', true);

    if (_.isEmpty(data) == false) {
        await handleData(setEnhance(data), broker)
    }

    if (_.isEmpty(next) == false) {
        while (hasContent) {
            await postgres.Pooling.saveUrl(`vindi-${entity}`, next);

            let content = await getContentByUrl(next);
            link = _.get(content, 'link', {});
            data = _.get(content, 'data.' + entity, []);
            next = _.get(link, 'next', '');
            result = !_.get(content, 'error', true);
            if (_.isEmpty(data) == false) {
                await handleData(setEnhance(data), broker);
            }
            if (_.isEmpty(next) == true) {
                hasContent = false;
            }
        }
    }
    return result
}

export const getDataFromURL = async (entity, filter, handleData, broker, extra) => {
    let { url } = vindiConfig,
        uri = `${url}${entity}${filter}`,
        content = await getContentByUrl(uri),
        data = _.get(content, 'data.' + entity, []),
        result = !_.get(content, 'error', true);

    if (_.isEmpty(data) == false) {
        await handleData(setEnhance(data), broker, extra);
    }
    return result;
}
