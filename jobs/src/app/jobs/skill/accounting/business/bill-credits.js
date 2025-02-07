import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');


export const vindiCreditsGenerate = async (refDate) => {
  let rows = await postgres.Sales.listVindiCredits({refDate});

  log(`vindiCreditsGenerate: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleAmount = _.get(item, 'amount') || 0,
      chargeAmount = _.get(item, 'chargeAmount') || 0,
      creditAmount = _.round((saleAmount - chargeAmount), 2),
      saleId = _.get(item, 'id', ''),
      issued = _.get(item, 'taxDate', ''),
      billId = _.get(item, 'sourceId', '');

    if (creditAmount > 0) {
      let idCredit = md5(`${billId}`),
        dataCredit = {
          id: idCredit,
          customerId: _.get(item, 'customerId', ''),
          tag: 'avanti',
          date: issued,
          amount: creditAmount,
          balance: (-1 * creditAmount),
          sourceName: 'vindi',
          sourceDb: 'sales_vindi_bills',
          sourceId: billId,
          isActive: 'true'
        },
        dataPayment = {
          id: idCredit,
          sourceName: 'vindi',
          sourceDb: 'customerCredits',
          sourceId: idCredit,
          saleId: saleId,
          tag: 'avanti',
          refDate: issued,
          taxDate: issued,
          dueDate: issued,
          amount: creditAmount,
          status: 'paid',
          type: 'billCredit',
          isConcilied: false,
          timeLog: getTimeLog()
        };
      await postgres.CustomerCredits.upsert(dataCredit);
      await postgres.SalePayments.upsert(dataPayment);
    } else {
      await postgres.Sales.update({isCredit: 'none'}, { where: { id: saleId } });
    }
  }
}

export const billCreditAccounting = async (refDate, broker) => {
  let rows = await postgres.SalePayments.listAccounting({refDate}), qtySent = 0;

  log(`billCreditAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'saleId', ''),
      modelId = _.get(item, 'id', ''),
      source = _.get(item, 'sourceName', ''),
      refDate = _.get(item, 'refDate', ''),
      amount = _.get(item, 'amount', 0),
      acctModel = 'crd_captura';

    if (amount > 0) {
      let modelCfgId = await getAccountingConfig(acctModel, source, 'financeiro', refDate),
        model = {
          id: md5(`${modelId}-${modelCfgId}`),
          sourceDb: 'salePayments',
          sourceId: modelId,
          refDate: _.get(item, 'refDate', ''),
          taxDate: _.get(item, 'taxDate', ''),
          dueDate: _.get(item, 'dueDate', ''),
          tag: _.get(item, 'tag', ''),
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          saleCaptured: {
            id: saleId,
            status: 'true'
          },
          saleAccounting: {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'sale',
              balance: (-1 * amount)
            }, {
              type: 'billCredit',
              balance: amount
            }]
          }
        };
      if (i >= rows.length - 1) {
        model['url'] = accountingConfig.url;
      }
      await broker.publish('incanto.Skill.AccountingItems.Post', model); qtySent++;
    }
  }

  return qtySent;
}

export const creditReverseAccounting = async (refDate, broker) => {
  let rows = await postgres.CustomerCredits.listAccounting({refDate}), qtySent = 0;

  log(`creditReverseAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'saleData.id', ''),
      modelId = _.get(item, 'id', ''),
      source = _.get(item, 'saleData.sourceName', ''),
      tag = _.get(item, 'saleData.tag', ''),
      cancelDate = _.get(item, 'saleData.cancelDate', ''),
      amount = _.get(item, 'amount', 0),
      acctModel = 'crd_cancelamento';

    if (amount > 0) {
      let modelCfgId = await getAccountingConfig(acctModel, source, 'financeiro', cancelDate),
        model = {
          id: md5(`${modelId}-${modelCfgId}`),
          sourceDb: 'customerCredits',
          sourceId: modelId,
          refDate: cancelDate,
          taxDate: cancelDate,
          dueDate: cancelDate,
          tag: tag,
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          saleCaptured: {
            id: saleId,
            status: 'true'
          },
          saleAccounting: {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'sale',
              balance: amount
            },{
              type: 'billCredit',
              balance: (-1 * amount)
            }]
          }
        };
      if (i >= rows.length - 1) {
        model['url'] = accountingConfig.url;
      }
      await postgres.CustomerCredits.update({isActive: 'false'}, { where: { id: modelId } });
      await broker.publish('incanto.Skill.AccountingItems.Post', model); qtySent++;
    }
  }

  return qtySent;
}

export const issuesAccounting = async (refDate, broker) => {
  let rows = await postgres.VindiIssues.listAccounting({refDate}), qtySent = 0;

  log(`issuesAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      modelId = _.get(item, 'id', ''),
      source = 'vindi',
      refDate = _.get(item, 'createDate', ''),
      amount = _.get(item, 'transactionAmount', 0),
      acctModel = 'crd_duplicidade';

    if (amount > 0) {
      let modelCfgId = await getAccountingConfig(acctModel, source, 'financeiro', refDate),
        model = {
          id: md5(`${modelId}-${modelCfgId}`),
          sourceDb: 'vindiIssues',
          sourceId: modelId,
          refDate: refDate,
          taxDate: refDate,
          dueDate: refDate,
          tag: 'avanti',
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount
        };
      if (i >= rows.length - 1) {
        model['url'] = accountingConfig.url;
      }
      await broker.publish('incanto.Skill.AccountingItems.Post', model); qtySent++;
    }
  }

  return qtySent;
}
