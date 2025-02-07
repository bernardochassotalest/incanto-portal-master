import _ from 'lodash'
import libAsync from 'async';
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/itau/boleto/parser'
import { saveTransaction } from 'app/jobs/skill/finance-files/itau/boleto/transactions'
import { saveConciliation } from 'app/jobs/skill/finance-files/itau/boleto/conciliation'
import { saveAccounting } from 'app/jobs/skill/finance-files/itau/boleto/accounting'

export const boletoParser = async (params) => {
    try {
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveTransaction(params);
        await saveConciliation(params);
        await saveAccounting(params);
    } catch (error) {
        throw error;
    }
}
