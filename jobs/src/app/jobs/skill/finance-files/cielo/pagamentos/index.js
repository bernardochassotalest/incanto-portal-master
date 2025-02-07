import _ from 'lodash'
import libAsync from 'async';
import { loadPontoVenda } from 'app/jobs/skill/commons/utils'
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/cielo/pagamentos/parser'
import { saveBatches } from 'app/jobs/skill/finance-files/cielo/pagamentos/batches'
import { saveConciliation } from 'app/jobs/skill/finance-files/cielo/pagamentos/conciliation'
import { saveAccounting } from 'app/jobs/skill/finance-files/cielo/pagamentos/accounting'
import { saveSettlement } from 'app/jobs/skill/finance-files/cielo/pagamentos/settlement'

export const pagamentosParser = async (params) => {
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
