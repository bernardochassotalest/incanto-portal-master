import _ from 'lodash';
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import { estornoPecldAccounting } from './pecld';
import { getAccountingConfig } from 'app/jobs/skill/commons/utils';
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const creditCardSaleId = async (refDate) => {
  let rows = await postgres.AcquirerTransactions.listSaleId({refDate});

  log(`creditCardSaleId: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      transactionId = _.get(item, 'id', ''),
      saleId = _.get(item, 'creditcardData.paymentData.saleId', '');

    if (_.isEmpty(saleId) === false) {
      await postgres.AcquirerTransactions.update({saleId}, { where: { id: transactionId } });
    }
  }
}

export const creditCardAccounting = async (refDate, broker) => {
  let rows = await postgres.AcquirerInstallments.listAccounting({refDate}), qtySent = 0;

  log(`creditCardAccounting: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      saleId = _.get(item, 'transData.saleData.id', ''),
      taxDate = _.get(item, 'transData.saleData.taxDate', ''),
      isCaptured = _.get(item, 'transData.saleData.isCaptured', ''),
      isPecld = _.get(item, 'transData.saleData.isPecld', ''),
      grossAmount = _.get(item, 'grossAmount', 0),
      acctContent = _.get(item, 'acctContent', '');

    if (_.isEmpty(acctContent) == false) {
      let accountings = JSON.parse(acctContent);
      for (let i = 0; i < accountings.length; i++) {
        let item = accountings[i], model = {},
            source = _.get(item, 'source', ''),
            itemId = _.get(item, 'itemId', ''),
            regular = _.get(item, 'regular', {}),
            extra = _.get(item, 'extra', {}),
            notCaptured = _.get(item, 'notCaptured', {}),
            modelType = _.get(regular, 'model', ''),
            makeNotCaptured = ((isCaptured === 'false') && (_.isEmpty(notCaptured) == false)),
            makePecld = ((makeNotCaptured == true) && (isPecld === 'true'));
        if (makeNotCaptured == true) {
          model = { ...notCaptured, ...extra };
        } else {
          model = { ...regular, ...extra };
        }
        let amount = _.get(model, 'amount', 0);
        if (_.isEmpty(taxDate) == false) {
          _.set(model, 'taxDate', taxDate);
        }
        if (_.isEmpty(saleId) == false) {
          let saleAccounting = {
              saleId: saleId,
              amount: amount,
              timeLog: getTimeLog(),
              balances: []
            };
          if (modelType == 'adq_captura') {
            saleAccounting.balances.push({ type: 'creditCard', balance: amount })
          }
          if (makeNotCaptured == true) {
            saleAccounting.balances.push({ type: 'notCaptured', balance: (-1 * amount) })
          } else {
            saleAccounting.balances.push({ type: 'sale', balance: (-1 * amount) })
          }
          _.set(model, 'saleCaptured', { id: saleId, status: 'true' });
          _.set(model, 'saleAccounting', saleAccounting)
          if (makePecld == true) {
            let data = {
              source, itemId, saleId,
              amount: grossAmount,
              sourceDb: model.sourceDb,
              sourceId: model.sourceId,
              refDate: model.refDate,
              taxDate: model.taxDate,
              tag: model.tag,
            };
            await estornoPecldAccounting(data, broker);
          }
        }
        if (i >= rows.length - 1) {
          model['url'] = accountingConfig.url;
        }
        await broker.publish('incanto.Skill.AccountingItems.Post', model); qtySent++;
      }
    }
  }
  return qtySent;
}
