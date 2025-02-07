import _ from 'lodash'
import libAsync from 'async';
import acquirersConfig from 'config/acquirers';
import { vendasParser } from 'app/jobs/skill/finance-files/cielo/vendas'
import { pagamentosParser } from 'app/jobs/skill/finance-files/cielo/pagamentos'
import { antecipacaoParser } from 'app/jobs/skill/finance-files/cielo/antecipacao'
import { saldosParser } from 'app/jobs/skill/finance-files/cielo/saldos'
import { getFileData, updateFileStatus } from 'app/jobs/skill/commons/utils'

const parser = async (params) => {
    try {
        let fileType = _.get(params, 'fileInfo.FileType', '');

        params['GROUP_ACCOUNTING'] = acquirersConfig.groupAccounting;

        if (fileType == 'vendas') {
            await vendasParser(params);
        } else if (fileType == 'pagamentos') {
            await pagamentosParser(params);
        } else if (fileType == 'antecipacao') {
            await antecipacaoParser(params);
        } else if (fileType == 'saldos') {
            await saldosParser(params);
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
