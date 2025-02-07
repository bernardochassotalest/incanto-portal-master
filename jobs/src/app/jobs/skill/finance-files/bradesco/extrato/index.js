import _ from 'lodash'
import libAsync from 'async';
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/bradesco/extrato/parser'
import { saveTransaction } from 'app/jobs/skill/finance-files/bradesco/extrato/transactions'

export const extratoParser = async (params) => {
    try {
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveTransaction(params);
    } catch (error) {
        throw error;
    }
}
