import _ from 'lodash';

export const mergeAccounting = (content, accounting) => {
  for (let i = 0; i < content.length; i++) {
    let row = content[i],
      jeId = _.get(row, 'jeId', ''),
      debitLineId = _.get(row, 'debitLineId', ''),
      creditLineId = _.get(row, 'creditLineId', ''),
      filterDebit = { jeId, lineId: debitLineId },
      filterCredit = { jeId, lineId: creditLineId },
      foundDebit = _.findLast(accounting, filterDebit),
      foundCredit = _.findLast(accounting, filterCredit);
    row['debAcctCode'] = '';
    row['debAcctName'] = '';
    row['debCardCode'] = '';
    row['debCardName'] = '';
    row['crdAcctCode'] = '';
    row['crdAcctName'] = '';
    row['crdCardCode'] = '';
    row['crdCardName'] = '';
    row['memo'] = '';
    if (foundDebit) {
      let accountData = _.get(foundDebit, 'accountData', ''),
        businessPartner = _.get(foundDebit, 'businessPartner', '');
      if (_.isEmpty(accountData) == false) {
        row['debAcctCode'] = _.get(accountData, 'acctCode', '');
        row['debAcctName'] = _.get(accountData, 'acctName', '');
      }
      if (_.isEmpty(businessPartner) == false) {
        row['debCardCode'] = _.get(businessPartner, 'cardCode', '');
        row['debCardName'] = _.get(businessPartner, 'cardName', '');
      }
      row['memo'] = _.get(foundDebit, 'memo', '');
    }
    if (foundCredit) {
      let accountData = _.get(foundCredit, 'accountData', ''),
        businessPartner = _.get(foundCredit, 'businessPartner', '');
      if (_.isEmpty(accountData) == false) {
        row['crdAcctCode'] = _.get(accountData, 'acctCode', '');
        row['crdAcctName'] = _.get(accountData, 'acctName', '');
      }
      if (_.isEmpty(businessPartner) == false) {
        row['crdCardCode'] = _.get(businessPartner, 'cardCode', '');
        row['crdCardName'] = _.get(businessPartner, 'cardName', '');
      }
    }
  }
}
