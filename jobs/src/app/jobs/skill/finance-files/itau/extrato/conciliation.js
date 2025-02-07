import _ from 'lodash'
import { md5 } from 'app/lib/utils'

const RULE_MAP = {
  'creditcard': 'creditcard_settlement',
  'slip': 'slip_settlement',
  'directDebit': 'direct_debit_settlement',
  'slipFee': 'slip_fee'
}

const parserConciliation = (model) => {
    let result = {}, content = {},
        modelId = _.get(model, 'id', ''),
        type = _.get(model, 'conciliationType', ''),
        payDate = _.get(model, 'date', ''),
        concRule = RULE_MAP[type],
        id = md5(`${concRule}-itau-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'date', payDate);
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'itau');
    _.set(result, 'sourceDb', 'bankStatements');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'pointOfSale', _.get(model, 'pointOfSale', ''));
    _.set(result, 'keyCommon', _.get(model, 'keyCommon', ''));
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', '');
    _.set(result, 'debit', _.get(model, 'debit', 0));
    _.set(result, 'credit', _.get(model, 'credit', 0));
    _.set(result, 'balance', _.get(model, 'balance', 0));

    return result;
}

export const saveConciliation = async (params) => {
    try {
        const { transactions, broker } = params;

        for (var i = 0; i < transactions.length; i++) {
            const model = transactions[i];

            await broker.publish('incanto.Skill.ConciliationItems.Post', parserConciliation(model));
        }
    } catch (error) {
        throw error;
    }

    return params;
}
