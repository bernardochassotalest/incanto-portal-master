import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const parsedConciliationRecord = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        concRule = 'creditcard_capture',
        nroPv = _.get(model, 'nro_pv', ''),
        transactionId = md5(`rede-eevd-${modelId}`),
        id = md5(`${concRule}-rede-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'date', _.get(model, 'data'));
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'rede');
    _.set(result, 'sourceDb', 'acquirerTransactions');
    _.set(result, 'sourceId', transactionId);
    _.set(result, 'pointOfSale', sizedField(nroPv, 12));
    _.set(result, 'keyCommon', _.get(model, '_keys.Authorization', ''));
    _.set(result, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(result, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(result, 'credit', _.get(model, 'vl_bruto'));
    _.set(result, 'balance', _.get(model, 'vl_bruto'));

    return result;
}

const ticket58137Record = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        concRule = 'creditcard_capture',
        nroPv = _.get(model, 'nro_pv', ''),
        transactionId = md5(`rede-eevd-${modelId}`),
        id = md5(`${concRule}-rede-${modelId}-ticket58137`);

    _.set(result, 'id', id);
    _.set(result, 'date', _.get(model, 'data'));
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'rede');
    _.set(result, 'sourceDb', 'acquirerTransactions');
    _.set(result, 'sourceId', transactionId);
    _.set(result, 'pointOfSale', sizedField(nroPv, 12));
    _.set(result, 'keyCommon', 'Gerado Conforme Chamado 58137');
    _.set(result, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(result, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(result, 'debit', _.get(model, 'vl_bruto'));
    _.set(result, 'balance', (-1*_.get(model, 'vl_bruto')));

    return result;
}

const batchesConciliationRecord = (model) => {
    let result = {},
        modelId = _.get(model, 'id', ''),
        concRule = 'creditcard_settlement',
        nroPv = sizedField(_.get(model, 'pointOfSale', ''), 12),
        payDate = _.get(model, 'payDate', ''),
        id = md5(`${concRule}-rede-${modelId}`),
        balance = _.get(model, 'settlement', 0),
        credit = (balance < 0 ? (-1 * balance) : 0),
        debit = (balance > 0 ? balance : 0);

    _.set(result, 'id', id);
    _.set(result, 'date', payDate);
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'rede');
    _.set(result, 'sourceDb', 'acquirerBatches');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'pointOfSale', nroPv);
    _.set(result, 'keyCommon', `rede-${nroPv}-${payDate}`);
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', '');
    _.set(result, 'credit', credit);
    _.set(result, 'debit', debit);
    _.set(result, 'balance', (-1 * balance));

    return result;
}

export const saveConciliation = async (params) => {
    try {
        const { parsed, batches, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', ''),
                  tag = _.get(model, 'tag', '');

            if (registro == '05') {
                await broker.publish('incanto.Skill.ConciliationItems.Post', parsedConciliationRecord(model));
                if (tag === 'bilheteria') {
                  await broker.publish('incanto.Skill.ConciliationItems.Post', ticket58137Record(model));
                }
            }
        }

        for (var i = 0; i < batches.length; i++) {
            const model = batches[i],
                  group = _.get(model, 'group', '');
            if (group === 'liquidacao') {
                await broker.publish('incanto.Skill.ConciliationItems.Post', batchesConciliationRecord(model));
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
