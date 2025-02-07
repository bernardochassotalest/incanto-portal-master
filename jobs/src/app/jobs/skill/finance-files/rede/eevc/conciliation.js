import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const ACCEPTED_CV = '000';
const conciliationRecord = (model) => {
    let result = {}, content = {},
        modelId = _.get(model, '_id', ''),
        concRule = 'creditcard_capture',
        nroPv = _.get(model, 'nro_pv', ''),
        transactionId = md5(`rede-eevc-${modelId}`),
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
    let result = {}, content = {},
        modelId = _.get(model, '_id', ''),
        concRule = 'creditcard_capture',
        nroPv = _.get(model, 'nro_pv', ''),
        transactionId = md5(`rede-eevc-${modelId}`),
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

export const saveConciliation = async (params) => {
    try {
        const { parsed, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', ''),
                  statusCV = _.get(model, 'status_cv_nsu.code', ''),
                  tag = _.get(model, 'tag', '');

            if (((registro == '008') || (registro == '012')) && (statusCV == ACCEPTED_CV)) {
                await broker.publish('incanto.Skill.ConciliationItems.Post', conciliationRecord(model));
                if (tag === 'bilheteria') {
                  await broker.publish('incanto.Skill.ConciliationItems.Post', ticket58137Record(model));
                }
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
