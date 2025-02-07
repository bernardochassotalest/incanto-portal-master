import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, delay, sizedField } from 'app/lib/utils'

const settlementRecord05 = async ({ batches, parsed, fileName, broker }) => {
  for (let i = 0; i < parsed.length; i++) {
    let model = parsed[i],
      registro = _.get(model, 'registro', '');

    if (registro == '05') {
        const idResumo = _.get(model, '_resumo_venda', ''),
            resumo = _.findLast(batches, { type: 'liquidacao', batchGroup: idResumo }),
            modelId = _.get(model, '_id', ''),
            transactionId = md5(`rede-eevd-${modelId}`),
            amount = _.get(model, 'vl_liquido', 0),
            factor = (amount < 0 ? -1 : 1),
            installment = _.get(resumo, 'installment', ''),
            transType = _.get(resumo, 'type', ''),
            accountingItem = _.get(resumo, 'accountingItem', ''),
            data = {
              id: md5(`rede-eevd-${transactionId}-${installment}-${transType}`),
              transactionId: transactionId,
              installment: installment,
              transType: transType,
              dueDate: _.get(resumo, 'dueDate', ''),
              paidDate: _.get(resumo, 'payDate', ''),
              amount: (amount * factor),
              notes: _.get(resumo, 'notes', ''),
              fileName: fileName,
              fileLine: _.get(model, 'nro_linha', ''),
              accountingItemId: _.get(accountingItem, 'settlement', ''),
              saleId: '',
              saleAccountingId: '',
            };
        await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);
      }
  }
}

const settlementRecord011 = async ({ batches, parsed, fileName, broker }) => {
    const keyNsuGroups = _.map(_.filter(batches, (o) => { return _.isEmpty(o.keyNsu) == false } ), 'keyNsu');
    const transactions = await postgres.AcquirerTransactions.listByKeyNsu(keyNsuGroups);

    for (let i = 0; i < transactions.length; i++) {
      let model = transactions[i],
          keyNsu = _.get(model, 'keyNsu', ''),
          filterResumo = { 'keyNsu': keyNsu },
          resumos = _.filter(batches, filterResumo);

      for (let j = 0; j < resumos.length; j++) {
        let resumo = resumos[j],
            idResumo = _.get(resumo, 'id', ''),
            record011 = _.findLast(parsed, (o) => { return _.get(o, '_keys.Nsu', '') == keyNsu && o.registro == '011' }),
            transactionId = _.get(model, 'id', ''),
            saleId = _.get(model, 'saleId', ''),
            installment = _.get(resumo, 'installment', ''),
            transType = _.get(resumo, 'type', ''),
            accountingItem = _.get(resumo, 'accountingItem', ''),
            amount = _.get(resumo, 'adjustment', 0),
            factor = (amount < 0 ? -1 : 1),
            data = {
              id: md5(`rede-eevd-${transactionId}-${installment}-${transType}-${idResumo}`),
              transactionId: transactionId,
              installment: installment,
              transType: transType,
              dueDate: _.get(resumo, 'dueDate', ''),
              paidDate: _.get(resumo, 'payDate', ''),
              amount: (amount * factor),
              notes: _.get(resumo, 'notes', ''),
              fileName: fileName,
              fileLine: _.get(record011, 'nro_linha', ''),
              accountingItemId: _.get(accountingItem, 'settlement', ''),
              saleId: saleId,
              saleAccountingId: '',
            };

        if (_.isEmpty(saleId) == false) {
          data['saleAccountingId'] = md5(`${saleId}-${data.accountingItemId}`);
        }
        await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);
      }
    }
}

export const saveSettlement = async (params) => {
  try {
    const { batches, parsed, fileName, broker } = params;

    await delay(2500);

    await settlementRecord05({batches, parsed, fileName, broker});
    await settlementRecord011({batches, parsed, fileName, broker});
  } catch (error) {
    throw error;
  }

  return params;
}
