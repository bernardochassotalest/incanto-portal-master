import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export const generateAccounting = async (refDate, broker) => {
  let rows = await postgres.AccountingItems.list({refDate}),
    grouped = _.values(_.groupBy(rows, 'jeId'));

  log(`generateAccounting: ${refDate}`);
  for (let j = 0; j < grouped.length; j++) {
    let groupItem = grouped[j],
      firstItem = _.first(groupItem),
      jeId = _.get(firstItem, 'jeId', ''),
      baseMemo = _.get(firstItem, 'accountingData.accountingModel.baseMemo', ''),
      extraMemo = _.get(firstItem, 'extraMemo', ''),
      model = {
        id: jeId,
        status: 'pending',
        group: _.get(firstItem, 'accountingData.accountingModel.group', ''),
        refDate: _.get(firstItem, 'refDate', ''),
        taxDate: _.get(firstItem, 'taxDate', ''),
        dueDate: _.get(firstItem, 'dueDate', ''),
        locTotal: 0,
        tag: _.get(firstItem, 'tag', ''),
        memo: `${baseMemo}${extraMemo}`,
        ref3: '',
        projectId: '',
        pointOfSale: _.get(firstItem, 'pointOfSale', ''),
        championshipId: _.get(firstItem, 'championshipId', ''),
        matchId: _.get(firstItem, 'matchId', ''),
        transId: '',
        lines: []
      };

    log(`Processando: ${jeId} - ${model.refDate}`);
    for (let i = 0; i < groupItem.length; i++) {
      let acctItem = groupItem[i],
        acctItemId = _.get(acctItem, 'id', ''),
        debAccount = _.get(acctItem, 'accountingData.debAccount') || '',
        debShortName = _.get(acctItem, 'accountingData.debShortName') || '',
        debCostingCenter = _.get(acctItem, 'accountingData.debCostingCenter') || '',
        debProject = _.get(acctItem, 'accountingData.debProject') || '',
        crdAccount = _.get(acctItem, 'accountingData.crdAccount') || '',
        crdShortName = _.get(acctItem, 'accountingData.crdShortName') || '',
        crdCostingCenter = _.get(acctItem, 'accountingData.crdCostingCenter') || '',
        crdProject = _.get(acctItem, 'accountingData.crdProject') || '',
        idDebit = md5(`${debAccount}-${debShortName}-${debCostingCenter}-${debProject}`),
        idCredit = md5(`${crdAccount}-${crdShortName}-${crdCostingCenter}-${crdProject}`),
        baseMemo = _.get(acctItem, 'accountingData.accountingModel.baseMemo', ''),
        extraMemo = _.get(acctItem, 'extraMemo', ''),
        amount = _.round(_.get(acctItem, 'amount', 0), 2),
        filterDebit = { lineId: idDebit },
        filterCredit = { lineId: idCredit },
        foundDebit = _.findLast(model.lines, filterDebit),
        foundCredit = _.findLast(model.lines, filterCredit);

      if (foundDebit) {
        foundDebit['debit'] += amount;
        foundDebit['balance'] += (-1 * amount);
      } else {
        let debitLine = {
          jeId: jeId,
          lineId: idDebit,
          visOrder: 0,
          account: debAccount,
          shortName: debShortName || null,
          debit: amount,
          credit: 0,
          balance: (-1 * amount),
          costingCenter: debCostingCenter || null,
          project: debProject || null,
          memo: `${baseMemo}${extraMemo}`
        };
        model.lines.push(debitLine);
      }
      if (foundCredit) {
        foundCredit['credit'] += amount;
        foundCredit['balance'] += amount;
      } else {
        let creditLine = {
          jeId: jeId,
          lineId: idCredit,
          visOrder: 0,
          account: crdAccount,
          shortName: crdShortName || null,
          debit: 0,
          credit: amount,
          balance: amount,
          costingCenter: crdCostingCenter || null,
          project: crdProject || null,
          memo: `${baseMemo}${extraMemo}`
        };
        model.lines.push(creditLine);
      }
      let idsAccounting = { id: acctItemId, debitLineId: idDebit, creditLineId: idCredit };
      if ((j >= grouped.length - 1) && (i >= groupItem.length - 1)) {
        idsAccounting['url'] = accountingConfig.url;
      }
      await broker.publish('incanto.Skill.AccountingItems.Put', idsAccounting);
    }
    model.lines = _.sortBy(_.filter(model.lines, (o) => {return _.round(o.debit + o.credit, 2) > 0;}), 'balance');
    if (_.isEmpty(model.lines) == false) {
      model.projectId = _.get(_.first(model.lines), 'project', '');
      model.memo = _.get(_.first(model.lines), 'memo', '');
      let visOrder = 1;
      model.lines.map((lineItem) => {
        lineItem.visOrder = visOrder; visOrder++;
        lineItem.debit = _.round(lineItem.debit, 2);
        lineItem.credit = _.round(lineItem.credit, 2);
        lineItem.balance = _.round(lineItem.balance, 2);
        model.locTotal += _.round(lineItem.credit, 2);
      })
      model.lines[model.lines.length-1].memo = model.memo;
      model.locTotal = _.round(model.locTotal, 2);
      if (j >= grouped.length - 1) {
        model['url'] = accountingConfig.url;
      }
      await broker.publish('incanto.Skill.JournalVouchers.Post', model);
    }
  }
}
