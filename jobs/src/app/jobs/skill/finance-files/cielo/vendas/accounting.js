import _ from 'lodash'
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
