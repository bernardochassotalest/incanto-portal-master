import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils'
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const pecldAccounting = async (refDate, broker) => {
  let rows = await postgres.Sales.listPecld({refDate}), qtySent = 0;

  log(`pecldAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'id', ''),
      modelId = _.get(item, 'sourceId', ''),
      source = _.get(item, 'sourceName', ''),
      amount = _.get(item, 'balance', 0),
      acctModel = 'pecld_provisao';

    if (amount > 0) {
      let modelCfgId = await getAccountingConfig(acctModel, source, 'financeiro', refDate),
        model = {
          id: md5(`${modelId}-${modelCfgId}`),
          sourceDb: 'sales',
          sourceId: modelId,
          refDate: refDate,
          taxDate: _.get(item, 'taxDate', ''),
          dueDate: refDate,
          tag: _.get(item, 'tag', ''),
          accountItem: modelCfgId,
          model: acctModel,
          amount: amount,
          salePecld: {
            id: saleId,
            status: 'true'
          },
          saleAccounting: {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'pecld',
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

export const pecldRevertAccounting = async (refDate, broker) => {
  let rows = await postgres.Sales.listRevertPecld({refDate}), qtySent = 0;

  log(`pecldRevertAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'id', ''),
      data = {
        source: _.get(item, 'sourceName', ''),
        refDate: _.get(item, 'refDate', ''),
        saleId: saleId,
        amount: _.get(item, 'pecld', 0),
        sourceDb: 'sales',
        sourceId: saleId,
        itemId: 'financeiro',
        taxDate: _.get(item, 'taxDate', ''),
        tag: _.get(item, 'tag', ''),
      };

    if (i >= rows.length - 1) {
      data['url'] = accountingConfig.url;
    }
    if (data.amount > 0) {
      if (data.refDate < '2021-04-30') {
        data['refDate'] = '2021-04-30';
      }
      await estornoPecldAccounting(data, broker);
      qtySent++;
    }
  }
  return qtySent;
}

export const estornoPecldAccounting = async (data, broker) => {
  let source = _.get(data, 'source', ''),
    itemId = _.get(data, 'itemId', ''),
    refDate = _.get(data, 'refDate', ''),
    taxDate = _.get(data, 'taxDate', ''),
    sourceDb = _.get(data, 'sourceDb', ''),
    sourceId = _.get(data, 'sourceId', ''),
    tag = _.get(data, 'tag', ''),
    saleId = _.get(data, 'saleId', ''),
    amount = _.get(data, 'amount', 0),
    url = _.get(data, 'url', '');

  if (amount > 0) {
    let acctModel = 'pecld_estorno',
      modelCfgId = await getAccountingConfig(acctModel, source, itemId, refDate),
      model = {
        id: md5(`${sourceId}-${refDate}-${modelCfgId}`),
        sourceDb: sourceDb,
        sourceId: sourceId,
        refDate: refDate,
        taxDate: taxDate,
        dueDate: refDate,
        tag: tag,
        accountItem: modelCfgId,
        model: acctModel,
        amount: amount
      };
    if (_.isEmpty(url) == false) {
      _.set(model, 'url', url);
    }
    if (_.isEmpty(saleId) == false) {
      _.set(model, 'salePecld', { id: saleId, status: 'false' });
      _.set(model, 'saleAccounting', { saleId, amount, timeLog: getTimeLog(), balances: [{ type: 'pecld', balance: (-1 * amount) }] });
    }
    await broker.publish('incanto.Skill.AccountingItems.Post', model);
  }
}
