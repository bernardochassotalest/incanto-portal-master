import _ from 'lodash';
import sequelize, { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'models'

class JournalEntries extends Model {
  static init(sequelize) {
    super.init({
      transId: { type: DataTypes.STRING, primaryKey: true },
      transType: DataTypes.STRING,
      refDate: DataTypes.STRING,
      taxDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      locTotal: DataTypes.DECIMAL(13, 2),
      tag: DataTypes.STRING,
      memo: DataTypes.STRING,
      ref1: DataTypes.STRING,
      ref2: DataTypes.STRING,
      ref3: DataTypes.STRING,
      projectId: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      championshipId: DataTypes.STRING,
      matchId: DataTypes.STRING,
      reversed: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'journalEntries'
    });
  }

  static associate(models) {
    this.hasOne(models.dateDimensions, { foreignKey: 'day', sourceKey: 'refDate', as: 'dimension' });
    this.hasOne(models.conciliations, { foreignKey: 'date', sourceKey: 'refDate', as: 'conciliation' });
    this.hasOne(models.sapB1Users, { foreignKey: 'id', sourceKey: 'userId', as: 'user' });
    this.hasMany(models.journalEntryItems, { foreignKey: 'transId', sourceKey: 'transId', as: 'items' });
  };

  static getExtraInclude(type, extra) {
    let result = {
        model: postgres.JournalEntryItems,
        as: 'items',
        required: true,
        attributes: [],
        include: []
      },
      conciliation = {
        model: postgres.ConciliationAccounts,
        as: 'acctConc',
        required: true,
        attributes: [],
        where: { type },
        on: {
          acctCode: sequelize.where(sequelize.col('items.acctConc.acctCode'), '=', sequelize.col('items.account')),
          cardCode: sequelize.where(
                        sequelize.fn('Coalesce', sequelize.col('items.acctConc.cardCode'), ''),
                        '=',
                        sequelize.fn('Coalesce', sequelize.col('items.shortName'), '')
                    )
        }
      };
    if (type == 'account') {
      result['where'] = { [Op.or]: { balDueDeb: { [Op.ne]: 0}, balDueCred: { [Op.ne]: 0} } };
    } else if (type == 'finance') {
      result['where'] = { extrMatch: { [Op.lte]: 0 } };
    }
    if (_.isEmpty(extra) == false) {
      conciliation['attributes'].push('type');
      conciliation['include'] = extra;
    }
    result.include.push(conciliation);
    return result;
  }

  static async listDashboardCalendar(month) {
    let attributes = ['refDate'], data = [],
      where = {
        '$dimension.month$': month
      },
      dimension = { model: postgres.DateDimensions, as: 'dimension', required: true, attributes: [] },
      includeAccount = [],
      includeFinance = [],
      group = ['journalEntries.refDate'];

    includeAccount.push(dimension);
    includeFinance.push(dimension);
    includeAccount.push(this.getExtraInclude('account'));
    includeFinance.push(this.getExtraInclude('finance'));

    data = _.concat(data, await this.findAll({attributes, include: includeAccount, where, group, raw: true }));
    data = _.concat(data, await this.findAll({attributes, include: includeFinance, where, group, raw: true }));
    data = _.uniqBy(data, 'refDate');

    return data;
  }

  static async listDashboardCards(from, to, tags) {
    let data = [], list = [],
      tagColumn = `((Case When Coalesce("journalEntries"."tag",'') = '' Then 'sep' Else "journalEntries"."tag" End))`,
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to },
        '$conciliation.status$': 'closed'
      },
      attributes = [[sequelize.literal(tagColumn), 'tag'],
                    [sequelize.fn('count', sequelize.col('journalEntries.transId')), 'count'],
                    [sequelize.fn('sum', sequelize.col('items.balDueDeb')), 'debit'],
                    [sequelize.fn('sum', sequelize.col('items.balDueCred')), 'credit']],
      conciliation = { model: postgres.Conciliations, as: 'conciliation', required: true, attributes: []},
      includeAccount = [],
      includeFinance = [],
      group = ['journalEntries.tag'];

    includeAccount.push(conciliation);
    includeFinance.push(conciliation);
    includeAccount.push(this.getExtraInclude('account'));
    includeFinance.push(this.getExtraInclude('finance'));

    if (_.isEmpty(tags) == false) {
      const tagsFilter = tags.map(item => `'${item}'`).join(',');
      where['tag'] = sequelize.where(sequelize.literal(tagColumn), 'in', sequelize.literal(`(${tagsFilter})`) );
    }

    list = _.concat(list, await this.findAll({where, attributes, include: includeAccount, group, raw: true }));
    list = _.concat(list, await this.findAll({where, attributes, include: includeFinance, group, raw: true }));

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        tag = _.get(row, 'tag', ''),
        debit = _.toNumber(_.get(row, 'debit') || 0),
        credit = _.toNumber(_.get(row, 'credit') || 0),
        item = {
          ruleCode: 'lcm_concilied',
          ruleName: 'Contas contábeis não conciliadas no SAP Business One',
          source: _.capitalize(tag),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: _.round(debit - credit, 2),
          filterJE: {
            tag: tag,
            startDate: from,
            endDate: to,
          }
        },
        found = _.findLast(data, { source: item.source });
      if (found) {
        found['count'] += item.count;
        found['amount'] += item.amount;
      } else {
        data.push(item);
      }
    }

    return data;
  };

  static async listDashboardDetails(tag, from, to, offset = 0) {
    let limit = PAGE_SIZE, rows = [],
      attributes = [[sequelize.fn('sum', sequelize.col('items.balDueDeb')),  'debit'],
                    [sequelize.fn('sum', sequelize.col('items.balDueCred')), 'credit']],
      tagColumn = `((Case When Coalesce("journalEntries"."tag",'') = '' Then 'sep' Else "journalEntries"."tag" End))`,
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to },
        tag: sequelize.where(sequelize.literal(tagColumn), '=', sequelize.literal(`'${tag}'`) ),
        '$conciliation.status$': 'closed'
      },
      conciliation = { model: postgres.Conciliations, as: 'conciliation', required: true, attributes: []},
      accountsInclude = [{
            model: postgres.ChartOfAccounts,
            as: 'chartOfAccount',
            required: true,
            attributes: ['acctCode', 'acctName']
          },{
            model: postgres.BusinessPartners,
            as: 'businessPartner',
            required: false,
            attributes: ['cardCode', 'cardName']
          }],
      includeAccount = [],
      includeFinance = [],
      group = ['items.acctConc.id', 'items.acctConc.type', 'items.acctConc.chartOfAccount.acctCode',
               'items.acctConc.chartOfAccount.acctName', 'items.acctConc.businessPartner.cardCode',
               'items.acctConc.businessPartner.cardName'],
      order = [['items', 'acctConc', 'id', 'ASC']];

    offset = isNaN(offset) ? 0 : offset * 1;

    includeAccount.push(conciliation);
    includeFinance.push(conciliation);
    includeAccount.push(this.getExtraInclude('account', accountsInclude));
    includeFinance.push(this.getExtraInclude('finance', accountsInclude));

    rows = _.concat(rows, await this.findAll({where, attributes, include: includeAccount, group, order, offset, limit, subQuery: false, raw:true }));
    rows = _.concat(rows, await this.findAll({where, attributes, include: includeFinance, group, order, offset, limit, subQuery: false, raw:true }));

    const data = rows.map((o) => {
      let debit = _.get(o, 'debit', 0),
        credit = _.get(o, 'credit', 0),
        row = {
          id: _.get(o, 'items.acctConc.id', ''),
          type: _.get(o, 'items.acctConc.type', ''),
          acctCode: _.get(o, 'items.acctConc.chartOfAccount.acctCode', ''),
          acctName: _.get(o, 'items.acctConc.chartOfAccount.acctName', ''),
          cardCode: _.get(o, 'items.acctConc.businessPartner.cardCode') || '',
          cardName: _.get(o, 'items.acctConc.businessPartner.cardName') || '',
          debit: debit,
          credit: credit,
          balance: _.round(debit - credit, 2),
        };
      return row;
    })

    return { rows: data, offset, count: data.length, limit };
  };
}

export default JournalEntries;
