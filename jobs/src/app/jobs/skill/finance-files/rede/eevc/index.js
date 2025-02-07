import _ from 'lodash'
import libAsync from 'async';
import { loadPontoVenda } from 'app/jobs/skill/commons/utils'
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/rede/eevc/parser'
import { saveConciliation } from 'app/jobs/skill/finance-files/rede/eevc/conciliation'
import { saveTransaction } from 'app/jobs/skill/finance-files/rede/eevc/transactions'
import { saveBatches } from 'app/jobs/skill/finance-files/rede/eevc/batches'
import { saveDisputes } from 'app/jobs/skill/finance-files/rede/eevc/disputes'

export const eevcParser = async (params) => {
    try {
        await loadPontoVenda(params);
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveConciliation(params);
        await saveTransaction(params);
        await saveBatches(params);
        await saveDisputes(params);
    } catch (error) {
        throw error;
    }
}
