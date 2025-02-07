import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'

const accountingRecord = async (model) => {
    let modelId = _.get(model, 'occurrence.id', ''),
        occurId = _.get(model, 'occurrence.occurId', ''),
        refDate = _.get(model, 'occurrence.date',  ''),
        tag = _.get(model, 'transaction.tag', ''),
        result = {};

    if (occurId === 'BD') {
      let captureCfgId = await getAccountingConfig('bnc_deb_captura', 'itau', tag, refDate),
          notCapturedCfgId = await getAccountingConfig('lmb_to_debito', 'itau', tag, refDate);

      result = {
            source: 'itau',
            regular: {
              id: md5(`${modelId}-${captureCfgId}`),
              accountItem: captureCfgId,
              model: 'bnc_deb_captura',
            },
            notCaptured: {
              id: md5(`${modelId}-${notCapturedCfgId}`),
              accountItem: notCapturedCfgId,
              model: 'lmb_to_debito'
            },
            extra: {
              sourceDb: 'directDebitOccurrences',
              sourceId: modelId,
              refDate: refDate,
              taxDate: '',
              dueDate: _.get(model, 'transaction.dueDate', ''),
              tag: tag,
              pointOfSale: '',
              amount: _.get(model, 'occurrence.amount', 0),
            }
        };
    }

    if (occurId === '00') {
      let settlementCfgId = await getAccountingConfig('bnc_deb_liquidacao', 'itau', tag, refDate);

      result = {
            source: 'itau',
            settlement: {
              id: md5(`${modelId}-${settlementCfgId}`),
              accountItem: settlementCfgId,
              model: 'bnc_deb_liquidacao'
            },
            extra: {
              sourceDb: 'directDebitOccurrences',
              sourceId: modelId,
              refDate: refDate,
              taxDate: '',
              dueDate: _.get(model, 'transaction.dueDate', ''),
              tag: tag,
              pointOfSale: '',
              amount: _.get(model, 'occurrence.amount', 0),
            }
        };
    }

    return result;
}

export const parserAccounting = async (directDebit) => {
  try {
    let type = _.get(directDebit, 'occurrence.type', '');
    if (type != 'none') {
      let acctContent = await accountingRecord(directDebit);

      _.set(directDebit, 'occurrence.acctContent', JSON.stringify(acctContent));
    }
  } catch (error) {
    throw error;
  }
}
