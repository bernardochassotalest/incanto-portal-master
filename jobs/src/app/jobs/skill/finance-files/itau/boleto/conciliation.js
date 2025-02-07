import _ from 'lodash'
import { md5 } from 'app/lib/utils'

const baseCapture = (model, concRule) => {
    let result = {}, content = {},
      cd_ocorrencia = _.get(model, 'ocorrencia.code', ''),
      modelId = _.get(model, '_id', ''),
      occurId = md5(`${modelId}-${cd_ocorrencia}`),
      id = md5(`${concRule}-itau-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'date', _.get(model, 'dt_ocorrencia'));
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'itau');
    _.set(result, 'sourceDb', 'slipOccurrences');
    _.set(result, 'sourceId', occurId);
    _.set(result, 'pointOfSale', '');
    _.set(result, 'keyCommon', _.get(model, '_keys.OurNumber', ''));
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', '');
    _.set(result, 'credit', _.get(model, 'vl_titulo', 0));
    _.set(result, 'balance', _.get(model, 'vl_titulo', 0));

    return result;
}
const captureRule = (model) => {
  return baseCapture(model, 'slip_capture')
}
const canceledRule = (model) => {
  return baseCapture(model, 'slip_canceled')
}

const settlementRule = (model) => {
    let result = {}, content = {},
        modelId = _.get(model, 'id', ''),
        concRule = 'slip_settlement',
        payDate = _.get(model, 'date', ''),
        id = md5(`${concRule}-itau-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'date', payDate);
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'itau');
    _.set(result, 'sourceDb', 'slipOccurrences');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'pointOfSale', '');
    _.set(result, 'keyCommon', _.get(model, '_keys.Settlement', ''));
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', _.get(model, '_keys.Account', ''));
    _.set(result, 'debit', _.get(model, 'amount', 0));
    _.set(result, 'balance', _.get(model, 'balance', 0));

    return result;
}

const feeRule = (model) => {
    let result = {}, content = {},
        modelId = _.get(model, 'id', ''),
        concRule = 'slip_fee',
        payDate = _.get(model, 'date', ''),
        id = md5(`${concRule}-itau-${modelId}`),
        amount = _.get(model, 'amount', 0);

    _.set(result, 'id', id);
    _.set(result, 'date', payDate);
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'itau');
    _.set(result, 'sourceDb', 'slipFees');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'pointOfSale', '');
    _.set(result, 'keyCommon', _.get(model, '_keys.Settlement', ''));
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', _.get(model, '_keys.Account', ''));
    _.set(result, 'credit', amount);
    _.set(result, 'balance', amount);

    return result;
}

export const saveConciliation = async (params) => {
    try {
        const { parsed, settlement, fees, broker } = params;

        for (let i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', ''),
                  ocorrencia = _.get(model, 'ocorrencia.code', ''),
                  tag = _.get(model, 'tag', '');

            if (tag == 'avanti') { //TODO: Retirar bloqueio de conciliação para Multiclubes
                  if (registro == '1') {
                    if (ocorrencia == '02') {
                      await broker.publish('incanto.Skill.ConciliationItems.Post', captureRule(model));
                    } else if (ocorrencia == '09') {
                      await broker.publish('incanto.Skill.ConciliationItems.Post', canceledRule(model));
                    }
                  }
            }
        }

        for (let j = 0; j < settlement.length; j++) {
            await broker.publish('incanto.Skill.ConciliationItems.Post', settlementRule(settlement[j]));
        }

        for (let w = 0; w < fees.length; w++) {
            await broker.publish('incanto.Skill.ConciliationItems.Post', feeRule(fees[w]));
        }
    } catch (error) {
        throw error;
    }

    return params;
}
