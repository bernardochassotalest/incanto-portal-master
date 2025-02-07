import _ from 'lodash'
import { md5 } from 'app/lib/utils'

const baseCapture = (model, concRule) => {
    let result = {}, content = {},
      cd_ocorrencia = _.get(model, 'ocorrencia1.code', ''),
      modelId = _.get(model, '_id', ''),
      occurId = md5(`${modelId}-${cd_ocorrencia}`),
      id = md5(`${concRule}-itau-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'itau');
    _.set(result, 'sourceDb', 'directDebitOccurrences');
    _.set(result, 'sourceId', occurId);
    _.set(result, 'pointOfSale', '');
    _.set(result, 'keyCommon', '');
    _.set(result, 'keyTid', '');
    _.set(result, 'keyNsu', '');

    return result;
}

const captureRule = (model) => {
  let result = baseCapture(model, 'direct_debit_capture');

  _.set(result, 'date', _.get(model, 'data_arquivo'));
  _.set(result, 'keyCommon', _.get(model, '_keys.DebitNumber', ''));
  _.set(result, 'keyNsu', _.get(model, '_keys.OurNumber', ''));
  _.set(result, 'credit', _.get(model, 'valor_agendado', 0));
  _.set(result, 'balance', _.get(model, 'valor_agendado', 0));

  return result;
}

const settlementRule = (model) => {
  let result = baseCapture(model, 'direct_debit_settlement');

  _.set(result, 'date', _.get(model, 'data_cobrada'));
  _.set(result, 'keyCommon', _.get(model, '_keys.Settlement', ''));
  _.set(result, 'debit', _.get(model, 'valor_cobrado', 0));
  _.set(result, 'balance', (-1 * _.get(model, 'valor_cobrado', 0)));

  return result;
}

export const saveConciliation = async (params) => {
    try {
        const { parsed, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', ''),
                  ocorrencia = _.get(model, 'ocorrencia1.code', ''),
                  tag = _.get(model, 'tag', '');

            if (tag == 'avanti') { //TODO: Retirar bloqueio de conciliação para Multiclubes
                if (registro == '3') {
                  if (ocorrencia == 'BD') {
                    await broker.publish('incanto.Skill.ConciliationItems.Post', captureRule(model));
                  } else if (ocorrencia == '00') {
                    await broker.publish('incanto.Skill.ConciliationItems.Post', settlementRule(model));
                  }
                }
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
