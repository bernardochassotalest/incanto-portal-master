import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, sizedField } from 'app/lib/utils'
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'

const accountingRecord = async (model) => {
    let modelId = _.get(model, 'installment.id', ''),
        acquirer = _.get(model, 'transaction.acquirer', ''),
        baseData = {
            sourceDb: 'acquirerInstallments',
            sourceId: modelId,
            refDate: _.get(model, 'transaction.captureDate', ''),
            taxDate: '',
            dueDate: _.get(model, 'installment.dueDate', ''),
            tag: _.get(model, 'transaction.tag', ''),
            pointOfSale: _.get(model, 'transaction.pointOfSale', '')
        },
        result = [];

    let saleRegCfgId = await getAccountingConfig('adq_captura', acquirer, baseData.tag, baseData.refDate),
        commRegCfgId = await getAccountingConfig('adq_taxa_administracao', acquirer, baseData.tag, baseData.refDate),
        saleNotCfgId = await getAccountingConfig('lmb_to_cartao_captura', acquirer, baseData.tag, baseData.refDate),
        commNotCfgId = await getAccountingConfig('lmb_to_cartao_taxa_adm', acquirer, baseData.tag, baseData.refDate),
        sale = {
            source: acquirer,
            itemId: baseData.tag,
            regular: {
              id: md5(`${modelId}-${saleRegCfgId}`),
              accountItem: saleRegCfgId,
              model: 'adq_captura',
            },
            notCaptured: {
              id: md5(`${modelId}-${saleNotCfgId}`),
              accountItem: saleNotCfgId,
              model: 'lmb_to_cartao_captura',
            },
            extra: {
              amount: _.get(model, 'installment.netAmount', 0),
              ...baseData
            }
        },
        commission = {
            source: acquirer,
            itemId: baseData.tag,
            regular: {
              id: md5(`${modelId}-${commRegCfgId}`),
              accountItem: commRegCfgId,
              model: 'adq_taxa_administracao',
            },
            notCaptured: {
              id: md5(`${modelId}-${commNotCfgId}`),
              accountItem: commNotCfgId,
              model: 'lmb_to_cartao_taxa_adm',
            },
            extra: {
              amount: _.get(model, 'installment.commission', 0),
              ...baseData
            }
        };

    result.push(sale);
    result.push(commission);

    return result;
}

const batchRecord = async (model) => {
    let modelId = _.get(model, 'id', ''),
        acquirer = _.get(model, 'acquirer', ''),
        acctModel = 'adq_' + _.get(model, 'type', ''),
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
        adjustment = _.get(model, 'adjustment', 0),
        factor = (amount < 0 ? -1 : 1),
        result = [];

    if (amount === 0) {
        amount = adjustment;
        factor = (amount < 0 ? -1 : 1);
    }

    if ((amount * factor) > 0) {
        let modelCfgId = await getAccountingConfig(acctModel, acquirer, baseData.tag, baseData.refDate),
            settlement = {
                id: md5(`${modelId}-${modelCfgId}`),
                accountItem: modelCfgId,
                model: acctModel,
                amount: (factor * amount),
                ...baseData
            };

        result.push(settlement);
        model['accountingItem'] = { settlement: settlement.id };
    }

    if ((adjustment * factor) > 0) {
      let estornoCfgId = await getAccountingConfig('adq_liquidacao', acquirer, baseData.tag, baseData.refDate),
          estorno = {
              id: md5(`${modelId}-${estornoCfgId}`),
              accountItem: estornoCfgId,
              model: 'adq_liquidacao',
              amount: adjustment,
              ...baseData
          };
      result.push(estorno);
    }


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

            const accountings = await batchRecord(model);
            if ((_.isEmpty(hasSettlementDate) == false) && (_.isEmpty(accountings) == false)) {
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

export const parserAccounting = async (transactions) => {
    try {
        for (var i = 0; i < transactions.length; i++) {
            const model = transactions[i],
                  acctContent = await accountingRecord(model);

            _.set(model, 'installment.acctContent', JSON.stringify(acctContent));
        }
    } catch (error) {
        throw error;
    }
}
