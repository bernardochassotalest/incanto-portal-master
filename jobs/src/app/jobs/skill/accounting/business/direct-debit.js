import _ from 'lodash';
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { estornoPecldAccounting } from './pecld';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils';
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const directDebitSaleId = async (refDate) => {
  let rows = await postgres.DirectDebitTransactions.listSaleId({refDate});

  log(`directDebitSaleId: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      transactionId = _.get(item, 'id', ''),
      saleId = _.get(item, 'debitData.paymentData.saleId', '');

    if (_.isEmpty(saleId) === false) {
      await postgres.DirectDebitTransactions.update({saleId}, { where: { id: transactionId } });
    }
  }
}

export const directDebitAccounting = async (refDate, broker) => {
  let rows = await postgres.DirectDebitOccurrences.listAccounting({refDate}), qtySent = 0;

  log(`directDebitAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'debitData.saleData.id', ''),
      taxDate = _.get(item, 'debitData.saleData.taxDate', ''),
      isCaptured = _.get(item, 'debitData.saleData.isCaptured', ''),
      isPecld = _.get(item, 'debitData.saleData.isPecld', ''),
      acctContent = _.get(item, 'acctContent', '');

    if (_.isEmpty(acctContent) == false) {
      let acctCapture = {}, acctSettlement = {},
        parsed = JSON.parse(acctContent),
        source = _.get(parsed, 'source', ''),
        regular = _.get(parsed, 'regular', {}),
        extra = _.get(parsed, 'extra', {}),
        notCaptured = _.get(parsed, 'notCaptured', {}),
        settlement = _.get(parsed, 'settlement', {}),
        makeNotCaptured = ((isCaptured === 'false') && (_.isEmpty(notCaptured) == false)),
        makePecld = ((makeNotCaptured == true) && (isPecld === 'true'));
      if (makeNotCaptured == true) {
        acctCapture = { ...notCaptured, ...extra };
      } else {
        acctCapture = { ...regular, ...extra };
      }
      acctSettlement = { ...settlement, ...extra };
      let amount = _.get(acctCapture, 'amount', 0);
      if (_.isEmpty(taxDate) == false) {
        _.set(acctCapture, 'taxDate', taxDate);
        _.set(acctSettlement, 'taxDate', taxDate);
      }
      if (_.isEmpty(saleId) == false) {
        let saleAccounting = {
              saleId: saleId,
              amount: amount,
              timeLog: getTimeLog(),
              balances: [{ type: 'directDebit', balance: amount }]
            },
            settlementBalances = {
              saleId: saleId,
              amount: amount,
              timeLog: getTimeLog(),
              balances: [{ type: 'directDebit', balance: (-1 * amount) }]
            };
        if (makeNotCaptured == true) {
          saleAccounting.balances.push({ type: 'notCaptured', balance: (-1 * amount) })
        } else {
          saleAccounting.balances.push({ type: 'sale', balance: (-1 * amount) })
        }
        _.set(acctCapture, 'saleCaptured', { id: saleId, status: 'true' });
        _.set(acctCapture, 'saleAccounting', saleAccounting)
        _.set(acctSettlement, 'saleAccounting', settlementBalances)
        if (makePecld == true) {
          let data = {
            source, saleId, amount,
            sourceDb: acctCapture.sourceDb,
            sourceId: acctCapture.sourceId,
            refDate: acctCapture.refDate,
            taxDate: acctCapture.taxDate,
            itemId: acctCapture.tag,
            tag: acctCapture.tag,
          };
          await estornoPecldAccounting(data, broker);
        }
      }
      if (i >= rows.length - 1) {
        acctCapture['url'] = accountingConfig.url;
      }
      if (_.isEmpty(regular) == false) {
        await broker.publish('incanto.Skill.AccountingItems.Post', acctCapture);
      }
      if (_.isEmpty(settlement) == false) {
        await broker.publish('incanto.Skill.AccountingItems.Post', acctSettlement);
      }
      qtySent++;
    }
  }
  return qtySent;
}
