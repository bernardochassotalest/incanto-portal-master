import _ from 'lodash';
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { estornoPecldAccounting } from './pecld';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils';
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const slipSaleId = async (refDate) => {
  let rows = await postgres.SlipTransactions.listSaleId({refDate});

  log(`slipSaleId: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      transactionId = _.get(item, 'id', ''),
      saleId = _.get(item, 'slipData.paymentData.saleId', '');

    if (_.isEmpty(saleId) === false) {
      await postgres.SlipTransactions.update({saleId}, { where: { id: transactionId } });
    }
  }
}

export const slipAccounting = async (refDate, broker) => {
  let rows = await postgres.SlipOccurrences.listAccounting({refDate}), qtySent = 0;

  log(`slipAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'slipData.saleData.id', ''),
      taxDate = _.get(item, 'slipData.saleData.taxDate', ''),
      isCaptured = _.get(item, 'slipData.saleData.isCaptured', ''),
      isPecld = _.get(item, 'slipData.saleData.isPecld', ''),
      acctContent = _.get(item, 'acctContent', ''),
      occurType = _.get(item, 'type', '');

    if (_.isEmpty(acctContent) == false) {
      let parsed = JSON.parse(acctContent), item = {},
        source = _.get(parsed, 'source', ''),
        regular = _.get(parsed, 'regular', {}),
        extra = _.get(parsed, 'extra', {}),
        notCaptured = _.get(parsed, 'notCaptured', {}),
        makeNotCaptured = ((isCaptured === 'false') && (_.isEmpty(notCaptured) == false)),
        makePecld = ((makeNotCaptured == true) && (isPecld === 'true'));
      if (makeNotCaptured == true) {
        item = { ...notCaptured, ...extra };
      } else {
        item = { ...regular, ...extra };
      }
      let amount = _.get(item, 'amount', 0);
      if (_.isEmpty(taxDate) == false) {
        _.set(item, 'taxDate', taxDate);
      }
      if (_.isEmpty(saleId) == false) {
        let factor = (occurType == 'capture' ? 1 : -1),
          saleAccounting = {
            saleId: saleId,
            amount: amount,
            timeLog: getTimeLog(),
            balances: [{
              type: 'slip',
              balance: (factor * amount)
            }]
          };
        if (occurType == 'capture') {
          if (makeNotCaptured == true) {
            saleAccounting.balances.push({ type: 'notCaptured', balance: (-1 * amount) })
          } else {
            saleAccounting.balances.push({ type: 'sale', balance: (-1 * amount) })
          }
          _.set(item, 'saleCaptured', { id: saleId, status: 'true' });
        } else if (occurType == 'cancellation') {
          saleAccounting.balances.push({ type: 'sale', balance: amount })
        }
        _.set(item, 'saleAccounting', saleAccounting)
        if (makePecld == true) {
          let data = {
            source, saleId, amount,
            sourceDb: item.sourceDb,
            sourceId: item.sourceId,
            refDate: item.refDate,
            taxDate: item.taxDate,
            itemId: item.tag,
            tag: item.tag,
          };
          await estornoPecldAccounting(data, broker);
        }
      }
      if (i >= rows.length - 1) {
        item['url'] = accountingConfig.url;
      }
      await broker.publish('incanto.Skill.AccountingItems.Post', item); qtySent++;
    }
  }
  return qtySent;
}
