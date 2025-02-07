import _ from 'lodash'
import libAsync from 'async';
import acquirersConfig from 'config/acquirers';
import { eevdParser } from 'app/jobs/skill/finance-files/rede/eevd'
import { eevcParser } from 'app/jobs/skill/finance-files/rede/eevc'
import { eefiParser } from 'app/jobs/skill/finance-files/rede/eefi'
import { eesaParser } from 'app/jobs/skill/finance-files/rede/eesa'
import { getFileData, updateFileStatus } from 'app/jobs/skill/commons/utils'

const parser = async (params) => {
    try {
        let fileType = _.get(params, 'fileInfo.FileType', '');

        params['GROUP_ACCOUNTING'] = acquirersConfig.groupAccounting;

        if (fileType == 'eevd') {
            await eevdParser(params);
        } else if (fileType == 'eevc') {
            await eevcParser(params);
        } else if (fileType == 'eefi') {
            await eefiParser(params);
        } else if (fileType == 'eesa') {
            await eesaParser(params);
        }
    } catch (err) {
        throw err;
    }
    return params;
}

export const parserFile = async (params) => {
    try {
        await getFileData(params)
        await parser(params)
    } catch (err) {
        params['Status'] = 'error';
        params['ErrorMessage'] = 'Error -> ' + err;
    } finally {
        await updateFileStatus(params)
    }
    return params;
}
