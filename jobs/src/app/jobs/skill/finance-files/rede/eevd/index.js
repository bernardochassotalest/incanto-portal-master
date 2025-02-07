import _ from 'lodash'
import libAsync from 'async';
import { loadPontoVenda } from 'app/jobs/skill/commons/utils'
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/rede/eevd/parser'
import { saveTransaction } from 'app/jobs/skill/finance-files/rede/eevd/transactions'
import { saveBatches } from 'app/jobs/skill/finance-files/rede/eevd/batches'
import { saveConciliation } from 'app/jobs/skill/finance-files/rede/eevd/conciliation'
import { saveAccounting } from 'app/jobs/skill/finance-files/rede/eevd/accounting'
import { saveSettlement } from 'app/jobs/skill/finance-files/rede/eevd/settlement'

export const eevdParser = async (params) => {
    try {
        await loadPontoVenda(params);
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveTransaction(params);
        await saveBatches(params);
        await saveConciliation(params);
        await saveAccounting(params);
        await saveSettlement(params);
    } catch (error) {
        throw error;
    }
}
