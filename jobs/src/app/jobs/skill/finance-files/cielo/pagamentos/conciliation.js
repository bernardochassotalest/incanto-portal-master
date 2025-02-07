import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const conciliationRecord = (model) => {
    let result = {}, content = {},
        modelId = _.get(model, 'id', ''),
        concRule = 'creditcard_settlement',
        nroPv = sizedField(_.get(model, 'pointOfSale', ''), 12),
        payDate = _.get(model, 'payDate', ''),
        id = md5(`${concRule}-cielo-${modelId}`),
        type = _.get(model, 'type', ''),
        balance = (type === 'cancelamento' ? _.get(model, 'adjustment', 0) : _.get(model, 'settlement', 0)),
        credit = (balance < 0 ? (-1 * balance) : 0),
        debit = (balance > 0 ? balance : 0);

    _.set(result, 'id', id);
    _.set(result, 'date', payDate);
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'cielo');
    _.set(result, 'sourceDb', 'acquirerBatches');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'pointOfSale', nroPv);
    _.set(result, 'keyCommon', `cielo-${nroPv}-${payDate}`);
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', '');
    _.set(result, 'credit', credit);
    _.set(result, 'debit', debit);
    _.set(result, 'balance', (-1 * balance));

    return result;
}

export const saveConciliation = async (params) => {
    try {
        const { batches, broker } = params;

        for (var i = 0; i < batches.length; i++) {
            const model = batches[i];

            await broker.publish('incanto.Skill.ConciliationItems.Post', conciliationRecord(model));
        }
    } catch (error) {
        throw error;
    }

    return params;
}
