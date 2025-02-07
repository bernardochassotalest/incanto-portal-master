import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const notCapturedAccounting = async (refDate, broker) => {
  let rows = await postgres.Sales.listNotCaptured({refDate}), qtySent = 0;

  log(`notCapturedAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'id', ''),
      modelId = _.get(item, 'sourceId', ''),
      source = _.get(item, 'sourceName', ''),
      taxDate = _.get(item, 'taxDate', ''),
      refDate = _.get(item, 'refDate', ''),
      dueDate = _.get(item, 'dueDate', ''),
      amount = _.get(item, 'balance', 0),
      acctModel = 'lmb_provisao';

    if (amount > 0) {
      if (taxDate == '2021-03-01') { refDate = '2021-03-01'; dueDate = '2021-03-08'; }
      if (taxDate == '2021-03-25') { refDate = '2021-03-25'; dueDate = '2021-03-26'; }
      let modelCfgId = await getAccountingConfig(acctModel, source, 'financeiro', refDate),
        model = {
          id: md5(`${modelId}-${refDate}-${modelCfgId}`),
          sourceDb: 'sales',
          sourceId: modelId,
          refDate: refDate,
          taxDate: taxDate,
          dueDate: dueDate,
          tag: _.get(item, 'tag', ''),
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          saleCaptured: {
            id: saleId,
            status: 'false'
          },
          saleAccounting: {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'sale',
              balance: (-1 * amount)
            },{
              type: 'notCaptured',
              balance: amount
            }]
          }
        },
        payData = {
          id: md5(`${modelId}-${refDate}`),
          sourceName: 'vindi',
          sourceDb: 'sales',
          sourceId: saleId,
          saleId: saleId,
          tag: 'avanti',
          refDate: model.refDate,
          taxDate: model.taxDate,
          dueDate: model.dueDate,
          amount: amount,
          status: 'pending',
          type: 'none',
          isConcilied: false,
          timeLog: getTimeLog()
        };
      if (i >= rows.length - 1) {
        model['url'] = accountingConfig.url;
      }
      await postgres.SalePayments.upsert(payData);
      await broker.publish('incanto.Skill.AccountingItems.Post', model); qtySent++;
    }
  }
  return qtySent;
}
