import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, sizedField } from 'app/lib/utils'
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'

const accountingRecord = async (model) => {
    let modelId = _.get(model, 'id', ''),
        acquirer = _.get(model, 'acquirer', ''),
        baseData = {
            sourceDb: 'acquirerBatches',
            sourceId: modelId,
            refDate: _.get(model, 'refDate', ''),
            taxDate: _.get(model, 'taxDate', ''),
            dueDate: _.get(model, 'dueDate', ''),
            tag: _.get(model, 'tag', ''),
            pointOfSale: _.get(model, 'pointOfSale', '')
        },
        result = [];

    let settCfgId = await getAccountingConfig('adq_antecipacao', acquirer, baseData.tag, baseData.refDate),
        feeCfgId = await getAccountingConfig('adq_taxa_antecipacao', acquirer, baseData.tag, baseData.refDate),
        settlement = {
            id: md5(`${modelId}-${settCfgId}`),
            accountItem: settCfgId,
            model: 'adq_antecipacao',
            amount: _.get(model, 'settlement', 0),
            ...baseData
        },
        fee = {
            id: md5(`${modelId}-${feeCfgId}`),
            accountItem: feeCfgId,
            model: 'adq_taxa_antecipacao',
            amount: (-1 * _.get(model, 'fee', 0)),
            ...baseData
        };

    result.push(settlement);
    result.push(fee);

    model['accountingItem'] = { settlement: settlement.id, fee: fee.id };

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
