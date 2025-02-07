import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, sizedField } from 'app/lib/utils'
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'

const accountingRecord = async (model) => {
    let modelId = _.get(model, 'id', ''),
        acquirer = _.get(model, 'acquirer', ''),
        type = _.get(model, 'type', ''),
        acctModel = (type == 'cancelamento' ? 'adq_canc_captura' : `adq_${type}`),
        baseData = {
            sourceDb: 'acquirerBatches',
            sourceId: modelId,
            refDate: _.get(model, 'refDate', ''),
            taxDate: _.get(model, 'taxDate', ''),
            dueDate: _.get(model, 'dueDate', ''),
            tag: _.get(model, 'tag', ''),
            pointOfSale: _.get(model, 'pointOfSale', '')
        },
        amount = _.get(model, 'settlement', 0),
        adjustment = (-1 * _.get(model, 'adjustment', 0)),
        factor = (amount < 0 ? -1 : 1),
        result = [];

    let modelCfgId = await getAccountingConfig(acctModel, acquirer, baseData.tag, baseData.refDate),
        settlement = {
          id: md5(`${modelId}-${modelCfgId}`),
          accountItem: modelCfgId,
          model: acctModel,
          amount: (factor * amount),
          ...baseData
        };

    model['accountingItem'] = { settlement: settlement.id };

    if (type == 'cancelamento') {
      settlement['amount'] = adjustment;

      let commCfgId = await getAccountingConfig('adq_canc_taxa_adm', acquirer, baseData.tag, baseData.refDate),
          commission = {
              id: md5(`${modelId}-${commCfgId}`),
              accountItem: commCfgId,
              model: 'adq_canc_taxa_adm',
              amount: (-1 * _.get(model, 'commission', 0)),
              ...baseData
          };
      result.push(commission);
      _.set(model.accountingItem, 'commission', commission.id);
    }
    if (adjustment > 0) {
      let estornoCfgId = await getAccountingConfig('adq_liquidacao', acquirer, baseData.tag, baseData.refDate),
          estorno = {
              id: md5(`${modelId}-${estornoCfgId}`),
              accountItem: estornoCfgId,
              model: 'adq_liquidacao',
              amount: (-1 * adjustment),
              ...baseData
          };
      result.push(estorno);
    }
    result.push(settlement);

    return result;
}

export const saveAccounting = async (params) => {
    try {
        const { batches, broker } = params;
        const settlmentDates = await postgres.Conciliations.listSettlement();

        for (var i = 0; i < batches.length; i++) {
            const model = batches[i],
              refDate = _.get(model, 'refDate', ''),
              hasSettlementDate = _.findLast(settlmentDates, { date: refDate });

            const accountings = await accountingRecord(model);
            if (_.isEmpty(hasSettlementDate) == false) {
              for (let j = 0; j < accountings.length; j++) {
                  await broker.publish('incanto.Skill.AccountingItems.Post', accountings[j]);
              }
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
