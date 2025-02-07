import _ from 'lodash'
import { postgres } from 'app/models';
import { md5, sizedField } from 'app/lib/utils'

const settlementRecord034 = async ({ batches, parsed, fileName, broker }) => {
    const batchGroups = _.map(_.filter(batches, { type: 'liquidacao' } ), 'batchGroup');
    const transactions = await postgres.AcquirerTransactions.listByBatchGroup(batchGroups);

    for (let i = 0; i < transactions.length; i++) {
      let model = transactions[i],
          keyNsu = _.get(model, 'keyNsu', ''),
          idResumo = _.get(model, 'batchGroup', ''),
          filterResumo = { 'batchGroup': idResumo, 'type': 'liquidacao' },
          resumo = _.findLast(batches, filterResumo),
          filterRecord034 = { '_resumo_venda': idResumo, 'registro': '034' },
          record034 = _.findLast(parsed, filterRecord034),
          record035 = _.findLast(batches, { keyNsu }),
          transactionId = _.get(model, 'id', ''),
          saleId = _.get(model, 'saleId', ''),
          installment = _.get(resumo, 'installment', ''),
          transType = _.get(resumo, 'type', ''),
          accountingItem = _.get(resumo, 'accountingItem', ''),
          installments = _.get(model, 'installments', []),
          transParcel = _.findLast(installments, (o) => { return installment.substr(0, 2) === o.installment.substr(0, 2) }),
          amount = _.get(transParcel, 'netAmount', 0),
          factor = (amount < 0 ? -1 : 1),
          data = {
            id: md5(`rede-eefi-${transactionId}-${installment}-${transType}`),
            transactionId: transactionId,
            installment: installment,
            transType: transType,
            dueDate: _.get(resumo, 'dueDate', ''),
            paidDate: _.get(resumo, 'payDate', ''),
            amount: (amount * factor),
            notes: _.get(resumo, 'notes', ''),
            fileName: fileName,
            fileLine: _.get(record034, 'nro_linha', ''),
            accountingItemId: _.get(accountingItem, 'settlement', ''),
            saleId: saleId,
            saleAccountingId: '',
          };

      if (_.isEmpty(saleId) == false) {
        data['saleAccountingId'] = md5(`${saleId}-${data.accountingItemId}`);
      }
      if (_.isEmpty(record035) == true) {
        await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);
      }
    }
}

const settlementRecord036 = async ({ batches, parsed, fileName, broker }) => {
    const batchGroups = _.map(_.filter(batches, { type: 'antecipacao' } ), 'batchGroup');
    const transactions = await postgres.AcquirerTransactions.listByBatchGroup(batchGroups);

    for (let i = 0; i < transactions.length; i++) {
      let model = transactions[i],
          keyNsu = _.get(model, 'keyNsu', ''),
          idResumo = _.get(model, 'batchGroup', ''),
          filterResumo = { 'batchGroup': idResumo, 'type': 'antecipacao' },
          resumo = _.findLast(batches, filterResumo),
          filterRecord036 = { '_resumo_venda': idResumo, 'registro': '036' },
          record036 = _.findLast(parsed, filterRecord036),
          record035 = _.findLast(batches, { keyNsu }),
          taxa_antecipacao = _.get(record036, 'taxa_antecipacao', 0),
          transactionId = _.get(model, 'id', ''),
          saleId = _.get(model, 'saleId', ''),
          installment = _.get(resumo, 'installment', ''),
          transType = _.get(resumo, 'type', ''),
          accountingItem = _.get(resumo, 'accountingItem', ''),
          installments = _.get(model, 'installments', []),
          transParcel = _.findLast(installments, (o) => { return installment.substr(0, 2) === o.installment.substr(0, 2) }),
          netAmount = _.get(transParcel, 'netAmount', 0),
          fee = _.round((netAmount * taxa_antecipacao) / 100, 2),
          amount = _.round(netAmount - fee, 2),
          factor = (amount < 0 ? -1 : 1),
          data = {
            id: md5(`rede-eefi-${transactionId}-${installment}-${transType}`),
            transactionId: transactionId,
            installment: installment,
            transType: transType,
            dueDate: _.get(resumo, 'dueDate', ''),
            paidDate: _.get(resumo, 'payDate', ''),
            amount: (amount * factor),
            notes: _.get(resumo, 'notes', ''),
            fileName: fileName,
            fileLine: _.get(record036, 'nro_linha', ''),
            accountingItemId: _.get(accountingItem, 'settlement', ''),
            saleId: saleId,
            saleAccountingId: '',
          };

      if (_.isEmpty(saleId) == false) {
        data['saleAccountingId'] = md5(`${saleId}-${data.accountingItemId}`);
      }
      if (_.isEmpty(record035) == true) {
        await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);
        if (fee > 0) {
            let feeData = _.cloneDeep(data),
              transType = 'taxa_antecipacao';
            feeData['id'] = md5(`rede-eefi-${transactionId}-${installment}-${transType}`);
            feeData['transType'] = transType;
            feeData['accountingItemId'] = _.get(accountingItem, 'fee', '');
            feeData['amount'] = (fee * factor);
            if (_.isEmpty(saleId) == false) {
              feeData['saleAccountingId'] = md5(`${saleId}-${feeData.accountingItemId}`);
            }
            await broker.publish('incanto.Skill.AcquirerSettlement.Post', feeData);
        }
      }
    }
}

const settlementRecord035 = async ({ batches, parsed, fileName, broker }) => {
    const keyNsuGroups = _.map(_.filter(batches, (o) => { return _.isEmpty(o.keyNsu) == false } ), 'keyNsu');
    const transactions = await postgres.AcquirerTransactions.listByKeyNsu(keyNsuGroups);

    for (let i = 0; i < transactions.length; i++) {
      let model = transactions[i],
          keyNsu = _.get(model, 'keyNsu', ''),
          filterResumo = { 'keyNsu': keyNsu },
          resumo = _.findLast(batches, filterResumo),
          record035 = _.findLast(parsed, (o) => { return _.get(o, '_keys.Nsu', '') == keyNsu && o.registro == '035' }),
          transactionId = _.get(model, 'id', ''),
          saleId = _.get(model, 'saleId', ''),
          installment = _.get(resumo, 'installment', ''),
          transType = _.get(resumo, 'type', ''),
          accountingItem = _.get(resumo, 'accountingItem', ''),
          amount = _.get(resumo, 'adjustment', 0),
          factor = (amount < 0 ? -1 : 1),
          data = {
            id: md5(`rede-eefi-${transactionId}-${installment}-${transType}`),
            transactionId: transactionId,
            installment: installment,
            transType: transType,
            dueDate: _.get(resumo, 'dueDate', ''),
            paidDate: _.get(resumo, 'payDate', ''),
            amount: (amount * factor),
            notes: _.get(resumo, 'notes', ''),
            fileName: fileName,
            fileLine: _.get(record035, 'nro_linha', ''),
            accountingItemId: _.get(accountingItem, 'settlement', ''),
            saleId: saleId,
            saleAccountingId: '',
          };

      if (_.isEmpty(saleId) == false) {
        data['saleAccountingId'] = md5(`${saleId}-${data.accountingItemId}`);
      }

      await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);
      if (transType == 'cancelamento') {
        let commData = _.cloneDeep(data),
          vlComissao = _.get(resumo, 'commission', 0),
          transType = 'taxa_administracao';
        commData['id'] = md5(`rede-eefi-${transactionId}-${installment}-${transType}`);
        commData['transType'] = transType;
        commData['accountingItemId'] = _.get(accountingItem, 'commission', '');
        commData['amount'] = (vlComissao < 0 ? -1 : 1) * vlComissao;
        if (_.isEmpty(saleId) == false) {
          commData['saleAccountingId'] = md5(`${saleId}-${commData.accountingItemId}`);
        }
        await broker.publish('incanto.Skill.AcquirerSettlement.Post', commData);
      }
    }
}

export const saveSettlement = async (params) => {
  try {
    const { batches, parsed, fileName, broker } = params;

    await settlementRecord034({batches, parsed, fileName, broker});
    await settlementRecord036({batches, parsed, fileName, broker});
    await settlementRecord035({batches, parsed, fileName, broker});
  } catch (error) {
    throw error;
  }

  return params;
}
