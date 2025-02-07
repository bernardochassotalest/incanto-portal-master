import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const revenuesAccounting = async (refDate, broker) => {
  let rows = await postgres.Sales.listAccounting({refDate}), qtySent = 0;

  log(`revenuesAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'saleId', ''),
      modelId = _.get(item, 'id', ''),
      source = _.get(item, 'sourceName', ''),
      itemId = _.get(item, 'mappingId', ''),
      refDate = _.get(item, 'refDate', ''),
      amount = _.get(item, 'totalAmount', 0),
      acctModel = 'rct_provisao';

    if (amount != 0) {
      let modelCfgId = await getAccountingConfig(acctModel, source, itemId, refDate),
        model = {
          id: md5(`${modelId}-${modelCfgId}`),
          sourceDb: 'saleItems',
          sourceId: modelId,
          refDate: _.get(item, 'refDate', ''),
          taxDate: _.get(item, 'taxDate', ''),
          dueDate: _.get(item, 'dueDate', ''),
          tag: _.get(item, 'tag', ''),
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          saleAccounting: {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'sale',
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
