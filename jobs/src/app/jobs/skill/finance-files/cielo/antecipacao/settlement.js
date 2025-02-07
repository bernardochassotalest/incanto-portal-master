import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, sizedField } from 'app/lib/utils'

export const saveSettlement = async (params) => {
  try {
    const { batches, parsed, fileName, broker } = params;
    const batchGroups = _.map(batches, 'batchGroup');
    const transactions = await postgres.AcquirerTransactions.listByBatchGroup(batchGroups);

    for (let i = 0; i < parsed.length; i++) {
      let model = parsed[i],
        status_lancamento = _.get(model, 'status_lancamento', ''),
        registro = _.get(model, 'registro', '');

      if ((registro == '2') && (status_lancamento == 'pago')) {
        let filterResumo = {
              'cielo_key_group': _.get(model, 'cielo_key_group', '')
            },
            resumo = _.findLast(batches, filterResumo),
            filterTransaction = {
              'keyNsu': _.get(model, '_keys.Nsu', '')
            },
            acqTrans = _.findLast(transactions, filterTransaction),
            hasCancel = _.findLast(parsed, (o) => {
                              return ((o.tipo_lancamento == 'cancelamento') &&
                                      (_.get(o, '_keys.Nsu') ==  _.get(model, '_keys.Nsu', ''))) }),
            transactionId = _.get(acqTrans, 'id', ''),
            saleId = _.get(acqTrans, 'saleId', ''),
            modelId = _.get(model, '_id', ''),
            installment = _.get(resumo, 'installment', ''),
            accountingItem = _.get(resumo, 'accountingItem', ''),
            feeAcctId = _.get(accountingItem, 'fee', ''),
            amount = _.get(model, 'vl_antecipado', 0),
            factor = (amount < 0 ? -1 : 1),
            data = {
              id: md5(`cielo-06-antecipacao-${modelId}-${installment}`),
              transactionId: transactionId,
              installment: installment,
              transType: _.get(model, 'tipo_lancamento', ''),
              dueDate: _.get(resumo, 'dueDate', ''),
              paidDate: _.get(resumo, 'payDate', ''),
              amount: (amount * factor),
              notes: _.get(resumo, 'notes', ''),
              fileName: fileName,
              fileLine: _.get(model, 'nro_linha', ''),
              accountingItemId: _.get(accountingItem, 'settlement', ''),
              saleId: saleId,
              saleAccountingId: '',
            };

        if ((data.transType == 'liquidacao') && (_.isEmpty(hasCancel) == false)) {
          transactionId = '';
        }
        if (_.isEmpty(saleId) == false) {
          data['saleAccountingId'] = md5(`${saleId}-${data.accountingItemId}`);
        }
        if (_.isEmpty(transactionId) == false) {
          await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);

          if (_.isEmpty(feeAcctId) == false) {
            let feeData = _.cloneDeep(data),
              vlTaxa = _.get(model, 'vl_desconto', 0);
            feeData['id'] = md5(`cielo-04-antecipacao-taxa-${modelId}-${installment}`);
            feeData['transType'] = 'taxa_antecipacao';
            feeData['accountingItemId'] = feeAcctId;
            feeData['amount'] = (vlTaxa < 0 ? -1 : 1) * vlTaxa;
            feeData['saleAccountingId'] = md5(`${saleId}-${feeData.accountingItemId}`);
            await broker.publish('incanto.Skill.AcquirerSettlement.Post', feeData);
          }

        }
      }
    }
  } catch (error) {
    throw error;
  }

  return params;
}
