import _ from 'lodash'
import libAsync from 'async';
import { loadPontoVenda } from 'app/jobs/skill/commons/utils'
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/rede/eefi/parser'
import { saveBatches } from 'app/jobs/skill/finance-files/rede/eefi/batches'
import { saveConciliation } from 'app/jobs/skill/finance-files/rede/eefi/conciliation'
import { saveAccounting } from 'app/jobs/skill/finance-files/rede/eefi/accounting'
import { saveSettlement } from 'app/jobs/skill/finance-files/rede/eefi/settlement'

export const eefiParser = async (params) => {
    try {
        await loadPontoVenda(params);
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveBatches(params);
        await saveConciliation(params);
        await saveAccounting(params);
        await saveSettlement(params);
    } catch (error) {
        throw error;
    }
}
