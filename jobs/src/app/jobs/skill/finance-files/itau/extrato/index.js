import _ from 'lodash'
import libAsync from 'async';
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/itau/extrato/parser'
import { saveTransaction } from 'app/jobs/skill/finance-files/itau/extrato/transactions'
import { saveConciliation } from 'app/jobs/skill/finance-files/itau/extrato/conciliation'

export const extratoParser = async (params) => {
    try {
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveTransaction(params);
        await saveConciliation(params);
    } catch (error) {
        throw error;
    }
}