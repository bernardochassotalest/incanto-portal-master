import _ from 'lodash'
import libAsync from 'async';
import acquirersConfig from 'config/acquirers';
import { boletoParser } from 'app/jobs/skill/finance-files/bradesco/boleto'
import { extratoParser } from 'app/jobs/skill/finance-files/bradesco/extrato'
import { getFileData, updateFileStatus } from 'app/jobs/skill/commons/utils'

const parser = async (params) => {
    try {
        let fileType = _.get(params, 'fileInfo.FileType', '');

        params['GROUP_ACCOUNTING'] = acquirersConfig.groupAccounting;

        if (fileType == 'boleto') {
            await boletoParser(params);
        } else if (fileType == 'extrato') {
            await extratoParser(params);
        }
    } catch (error) {
        throw error;
    }
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
