import _ from 'lodash'
import axios from 'axios'
import { leftString, delay } from '../../lib/utils'

const GetUser = (content) => {
  const result = {
    id: _.get(content, 'UserId', ''),
    name: _.get(content, 'UserName', '')
  };
  result.name = leftString(result.name, 100);
  return result;
}

const GetHeader = (content) => {
  const result = {
      transId: _.get(content, 'TransId', ''),
      transType: _.get(content, 'TransType', ''),
      refDate: _.get(content, 'RefDate', ''),
      taxDate: _.get(content, 'TaxDate', ''),
      dueDate: _.get(content, 'DueDate', ''),
      locTotal: _.get(content, 'LocTotal', 0),
      tag: _.get(content, 'Tag', ''),
      memo: _.get(content, 'Memo', ''),
      ref1: _.get(content, 'Ref1', ''),
      ref2: _.get(content, 'Ref2', ''),
      ref3: _.get(content, 'Ref3', ''),
      projectId: _.get(content, 'Project.Code') || '',
      pointOfSale: _.get(content, 'PointOfSale') || '',
      championshipId: _.get(content, 'Championship.Code') || '',
      matchId: _.get(content, 'Match.Code') || '',
      reversed: _.get(content, 'Reversed', ''),
      userId: _.get(content, 'UserId', ''),
    };
  if (_.isNumber(result.locTotal) == false) {
    result.locTotal = 0;
  }
  result.tag = leftString(result.tag, 20);
  result.memo = leftString(result.memo, 100);
  result.ref1 = leftString(result.ref1, 30);
  result.ref2 = leftString(result.ref2, 30);
  result.ref3 = leftString(result.ref3, 30);
  result.projectId = leftString(result.projectId, 20);
  result.pointOfSale = leftString(result.pointOfSale, 20);
  result.championshipId = leftString(result.championshipId, 50);
  result.matchId = leftString(result.matchId, 50);
  result.reversed = leftString(result.reversed, 10);
  return result;
}

const GetLine = (transId, content) => {
  const result = {
      transId: transId,
      lineId: _.get(content, 'LineId', ''),
      visOrder: _.get(content, 'VisOrder', ''),
      account: _.get(content, 'Account.Code', ''),
      shortName: _.get(content, 'ShortName.Code') || null,
      dueDate: _.get(content, 'DueDate', ''),
      debit: _.get(content, 'Debit', 0),
      credit: _.get(content, 'Credit', 0),
      balance: _.get(content, 'Balance', 0),
      balDueDeb: _.get(content, 'BalDueDeb', 0),
      balDueCred: _.get(content, 'BalDueCred', 0),
      extrMatch: _.get(content, 'ExtrMatch'),
      project: _.get(content, 'Project.Code') || null,
      contraAct: _.get(content, 'ContraAct', ''),
      memo: _.get(content, 'LineMemo', ''),
    };
  if (_.isNumber(result.debit) == false) {
    result.debit = 0;
  }
  if (_.isNumber(result.credit) == false) {
    result.credit = 0;
  }
  if (_.isNumber(result.balance) == false) {
    result.balance = 0;
  }
  if (_.isNumber(result.balDueDeb) == false) {
    result.balDueDeb = 0;
  }
  if (_.isNumber(result.balDueCred) == false) {
    result.balDueCred = 0;
  }
  if (_.isNumber(result.extrMatch) == false) {
    result.extrMatch = 0;
  }
  result.memo = leftString(result.memo, 100);
  return result;
}

const GetDistribution = (transId, content) => {
  const result = {
      transId: transId,
      lineId: _.get(content, 'LineId', ''),
      costingCenter: _.get(content, 'CostingCenter', ''),
      profitCode: _.get(content, 'ProfitCode', ''),
      validFrom: _.get(content, 'ValidFrom', ''),
      validTo: _.get(content, 'ValidTo', ''),
      factor: _.get(content, 'Factor', 0),
      debit: _.get(content, 'Debit', 0),
      credit: _.get(content, 'Credit', 0),
      balance: _.get(content, 'Balance', 0),

    };
  if (_.isNumber(result.factor) == false) {
    result.factor = 0;
  }
  if (_.isNumber(result.debit) == false) {
    result.debit = 0;
  }
  if (_.isNumber(result.credit) == false) {
    result.credit = 0;
  }
  if (_.isNumber(result.balance) == false) {
    result.balance = 0;
  }
  return result;
}

const GetDetails = (transId, content) => {
  const result = {
      transId: transId,
      lineId: _.get(content, 'LineId', ''),
      docEntry: _.get(content, 'DocEntry', ''),
      lineNum: _.get(content, 'LineNum', ''),
      itemCode: _.get(content, 'ItemCode', ''),
      description: _.get(content, 'Description', ''),
      memo: _.get(content, 'Memo', ''),
      lineTotal: _.get(content, 'LineTotal', 0),
    };
  if (_.isNumber(result.lineTotal) == false) {
    result.lineTotal = 0;
  }
  result.itemCode = leftString(result.itemCode, 50);
  result.description = leftString(result.description, 100);
  result.memo = leftString(result.memo, 500);
  return result;
}

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
  logger(`SapB1 - JournalEntry: ${content.TransId}`)
  const transaction = await postgres.JournalEntries.sequelize.transaction();

  try {
    const transId = _.get(content, 'TransId', ''),
      reconciliation = _.get(content, 'Reconciliation', ''),
      lines = _.get(content, 'Lines', []),
      details = _.get(content, 'ItemDetails', []),
      distributions = _.get(content, 'Distributions', []);

    if (reconciliation == true) {
      for (let i = 0; i < lines.length; i++) {
        let item = lines[i],
          lineId = _.get(item, 'LineId', ''),
          values = {
            balDueDeb: _.get(item, 'BalDueDeb', 0),
            balDueCred: _.get(item, 'BalDueCred', 0),
            extrMatch: _.get(item, 'ExtrMatch') || 0,
          };
        await postgres.JournalEntryItems.update(values, { where: { transId, lineId }, transaction });
      }
    } else {
      const where = { transId }, found = await postgres.JournalEntries.findOne({ where, transaction });
      if (found) {
        await postgres.JournalEntryDistributions.destroy({where: {transId}});
      } else {
        await postgres.SapB1Users.upsert(GetUser(content), { transaction });
      }
      await postgres.JournalEntries.upsert(GetHeader(content), { transaction });
      for (let i = 0; i < lines.length; i++) {
        await postgres.JournalEntryItems.upsert(GetLine(transId, lines[i]), { transaction });
      }
      for (let i = 0; i < distributions.length; i++) {
        await postgres.JournalEntryDistributions.upsert(GetDistribution(transId, distributions[i]), { transaction });
      }
      for (let i = 0; i < details.length; i++) {
        await postgres.JournalEntryItemDetails.upsert(GetDetails(transId, details[i]), { transaction });
      }
    }
    await transaction.commit();
    done()
  } catch(err) {
    logger(`Error saving JournalEntry: ${err}`);
    await transaction.rollback();
    throw err;
  }
}

const register = (params) => {
  saveData(params)
};

const queue = 'incanto.SapB1.JournalEntry.Post';

export { queue, register };
