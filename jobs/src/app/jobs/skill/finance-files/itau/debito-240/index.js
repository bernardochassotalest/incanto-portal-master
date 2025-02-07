import _ from 'lodash'
import libAsync from 'async';
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/itau/debito-240/parser'
import { saveTransaction } from 'app/jobs/skill/finance-files/itau/debito-240/transactions'
import { saveConciliation } from 'app/jobs/skill/finance-files/itau/debito-240/conciliation'

export const debito240Parser = async (params) => {
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
