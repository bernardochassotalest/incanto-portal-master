import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { estornoPecldAccounting } from './pecld';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const canceledAccounting = async (refDate, broker) => {
  let rows = await postgres.Sales.listCanceled({refDate}), qtySent = 0;

  log(`canceledAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'id', ''),
      modelId = _.get(item, 'sourceId', ''),
      source = _.get(item, 'sourceName', ''),
      refDate = _.get(item, 'cancelDate', ''),
      amount = _.get(item, 'balance', 0),
      isPecld = _.get(item, 'isPecld', ''),
      acctModel = 'lmb_cancelamento';

    if (amount > 0) {
      let modelCfgId = await getAccountingConfig(acctModel, source, 'financeiro', refDate),
        model = {
          id: md5(`${modelId}-${refDate}-${modelCfgId}`),
          sourceDb: 'sales',
          sourceId: modelId,
          refDate: _.get(item, 'cancelDate', ''),
          taxDate: _.get(item, 'taxDate', ''),
          dueDate: _.get(item, 'cancelDate', ''),
          tag: _.get(item, 'tag', ''),
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          saleAccounting: {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'notCaptured',
              balance: (-1 * amount)
            }]
          }
        };
      if (i >= rows.length - 1) {
        model['url'] = accountingConfig.url;
      }
      await broker.publish('incanto.Skill.AccountingItems.Post', model); qtySent++;
      if (isPecld === 'true') {
        let data = {
          source, refDate, saleId, amount,
          sourceDb: model.sourceDb,
          sourceId: model.sourceId,
          itemId: 'financeiro',
          taxDate: model.taxDate,
          tag: model.tag,
        };
        await estornoPecldAccounting(data, broker);
      }
    }
  }
  return qtySent;
}
