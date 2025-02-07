import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, sizedField } from 'app/lib/utils'
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'

const accountingRecord = async (model) => {
    let modelId = _.get(model, 'occurrence.id', ''),
        occurId = _.get(model, 'occurrence.occurId', ''),
        refDate = _.get(model, 'occurrence.date',  ''),
        tag = _.get(model, 'transaction.tag', ''), type = '';

    if (occurId === '02') {
      type = 'bnc_bol_captura';
    } else if (occurId === '06') {
      type = 'bnc_bol_liquidacao'
    } else if (occurId === '09') {
      type = 'bnc_bol_cancelamento'
    }

    let saleCfgId = await getAccountingConfig(type, 'itau', tag, refDate),
        result = {
            source: 'itau',
            regular: {
              id: md5(`${modelId}-${saleCfgId}`),
              accountItem: saleCfgId,
              model: type,
            },
            extra: {
              sourceDb: 'slipOccurrences',
              sourceId: modelId,
              refDate: refDate,
              taxDate: '',
              dueDate: _.get(model, 'transaction.dueDate', ''),
              tag: tag,
              pointOfSale: '',
              amount: _.get(model, 'occurrence.amount', 0),
            }
        };

    if (type == 'bnc_bol_captura') {
      let pecldCfgId = await getAccountingConfig('lmb_to_boleto', 'itau', tag, refDate),
        notCaptured = {
          id: md5(`${modelId}-${pecldCfgId}`),
          accountItem: pecldCfgId,
          model: 'lmb_to_boleto'
        };
      _.set(result, 'notCaptured', notCaptured);
    }

    return result;
}

const acctFeeRecord = async (model) => {
    let modelId = _.get(model, 'id', ''),
        acctModel = 'bnc_bol_tarifa',
        baseData = {
            sourceDb: 'slipFees',
            sourceId: modelId,
            refDate: _.get(model, 'date', ''),
            taxDate: _.get(model, 'date', ''),
            dueDate: _.get(model, 'date', ''),
            tag: _.get(model, 'tag', '')
        },
        amount = _.get(model, 'amount', 0);

    let modelCfgId = await getAccountingConfig(acctModel, 'itau', baseData.tag, baseData.refDate),
        result = {
          id: md5(`${modelId}-${modelCfgId}`),
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          ...baseData
        };

    return result;
}

export const parserAccounting = async (slip) => {
  try {
    let type = _.get(slip, 'occurrence.type', '');
    if (type != 'none') {
      let acctContent = await accountingRecord(slip);

      _.set(slip, 'occurrence.acctContent', JSON.stringify(acctContent));
    }
  } catch (error) {
    throw error;
  }
}

export const saveAccounting = async (params) => {
    try {
        const { fees, broker } = params;
        const settlmentDates = await postgres.Conciliations.listSettlement();

        for (var i = 0; i < fees.length; i++) {
            const model = fees[i],
              refDate = _.get(model, 'date', ''),
              hasSettlementDate = _.findLast(settlmentDates, { date: refDate });

            const accountFee = await acctFeeRecord(model);
            if (_.isEmpty(hasSettlementDate) == false) {
                await broker.publish('incanto.Skill.AccountingItems.Post', accountFee);
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
