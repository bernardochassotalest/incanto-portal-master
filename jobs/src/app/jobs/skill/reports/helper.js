import _ from 'lodash';
import Excel from 'exceljs';
import { getExportMap } from 'app/jobs/skill/reports/tables'

const mergeAccounting = (content, accounting) => {
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

export const mapData = (worksheet, type, content, logInfo, accounting, mergeAcct = true) => {
  let fieldExportMap = getExportMap(type);

  if (mergeAcct == true) {
    mergeAccounting(content, accounting);
  }
  worksheet.columns = _.keys(fieldExportMap).map((item) => { return { 'key': item, 'type': Excel.ValueType.String } })
  worksheet.getRow(1).values = _.values(fieldExportMap);
  content.map((row) => worksheet.addRow(row));
  worksheet.columns.forEach(function (column) {
    var dataMax = 0;
    column.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
      if (rowNumber == 1) {
          cell.font = { 'color': { 'argb': 'FFFFFF' }, 'bold': true };
          cell.fill = { 'type': 'pattern', 'pattern':'solid', 'fgColor':{'argb':'008000'} };
      }
      let current = cell.value?cell.value.toString().length:0;
      dataMax = current > dataMax ? current : dataMax;
    })
    column.width = dataMax < 10 ? 10 : dataMax + 4;
  });
  const cell = worksheet.getCell('CC1');
  cell.value = logInfo;

  worksheet.commit();

  return worksheet;
}
