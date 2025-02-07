import _ from 'lodash'
import libAsync from 'async';
import { loadPontoVenda } from 'app/jobs/skill/commons/utils'
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/cielo/vendas/parser'
import { saveConciliation } from 'app/jobs/skill/finance-files/cielo/vendas/conciliation'
import { saveTransaction } from 'app/jobs/skill/finance-files/cielo/vendas/transactions'
import { saveBatches } from 'app/jobs/skill/finance-files/cielo/vendas/batches'

export const vendasParser = async (params) => {
    try {
        await loadPontoVenda(params);
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveConciliation(params);
        await saveTransaction(params);
        await saveBatches(params);
    } catch (error) {
        throw error;
    }
}
