import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';
import { postgres } from 'models';

class AccountConfig extends Model {
  static init(sequelize) {
    super.init(
      {
        validFrom: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'accountConfigs',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.accountingModels, { foreignKey: 'model', as: 'accountingModel' });
    this.belongsTo(models.dataSources, { foreignKey: 'source', as: 'dataSource' });
    this.belongsTo(models.sourceItems, { foreignKey: 'item', as: 'sourceItem' });
    this.belongsTo(models.chartOfAccounts, { foreignKey: 'debAccount', as: 'debChartOfAccount' });
    this.belongsTo(models.businessPartners, { foreignKey: 'debShortName', as: 'debBusinessPartner' });
    this.belongsTo(models.costingCenters, { foreignKey: 'debCostingCenter', as: 'debitCostingCenter' });
    this.belongsTo(models.projects, { foreignKey: 'debProject', as: 'debitProject' });
    this.belongsTo(models.chartOfAccounts, { foreignKey: 'crdAccount', as: 'credChartOfAccount' });
    this.belongsTo(models.businessPartners, { foreignKey: 'crdShortName', as: 'credBusinessPartner' });
    this.belongsTo(models.costingCenters, { foreignKey: 'crdCostingCenter', as: 'creditCostingCenter' });
    this.belongsTo(models.projects, { foreignKey: 'crdProject', as: 'creditProject' });
    this.hasMany(models.accountingItems, { sourceKey: 'id', foreignKey: 'accountItem', as: 'acctItems' });
  };

  static async load({ id }) {
    const where = { id };
    const include = [
      { required: false, as: 'accountingModel', model: postgres.AccountingModel, attributes: ['id', 'name'] },
      { required: false, as: 'dataSource', model: postgres.DataSource, attributes: ['id', 'name'] },
      { required: false, as: 'sourceItem', model: postgres.SourceItem, attributes: ['id', 'name'] },
      { required: false, as: 'debChartOfAccount', model: postgres.ChartOfAccounts, attributes: ['acctCode', 'acctName', 'lockManual'] },
      { required: false, as: 'debBusinessPartner', model: postgres.BusinessPartners, attributes: ['cardCode', 'cardName'] },
      { required: false, as: 'debitCostingCenter', model: postgres.CostingCenters, attributes: ['ocrCode', 'ocrName'] },
      { required: false, as: 'debitProject', model: postgres.Projects, attributes: ['prjCode', 'prjName'] },
      { required: false, as: 'credChartOfAccount', model: postgres.ChartOfAccounts, attributes: ['acctCode', 'acctName', 'lockManual'] },
      { required: false, as: 'credBusinessPartner', model: postgres.BusinessPartners, attributes: ['cardCode', 'cardName'] },
      { required: false, as: 'creditCostingCenter', model: postgres.CostingCenters, attributes: ['ocrCode', 'ocrName'] },
      { required: false, as: 'creditProject', model: postgres.Projects, attributes: ['prjCode', 'prjName'] },
    ];
    let result = await this.findOne({ where, include });
    result['validFrom'] += 'T12:00:00.000Z';
    return result;
  };

  static async countJE({ id }) {
    const where = { id };
    const include = [{
      model: postgres.AccountingItem,
      as: 'acctItems',
      required: true,
      attributes: ['id'],
      include: [{
        model: postgres.JournalVoucher,
        as: 'journalVoucher',
        required: true,
        where: { status: 'closed' },
        attributes: ['id']
      }]
    }]
    return await this.count({ where, include });
  }

  static async list({ source, model, item, offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [[sequelize.literal('"accountingModel"."name"'), 'ASC'],['source', 'ASC'],['item', 'ASC']],
      attributes = ['id', 'validFrom', 'createdAt', 'item', 'isActive'],
      include = [
        { as: 'accountingModel', model: postgres.AccountingModel, attributes: ['name'] },
        { as: 'debChartOfAccount', model: postgres.ChartOfAccounts, attributes: ['acctCode', 'acctName'] },
        { as: 'credChartOfAccount', model: postgres.ChartOfAccounts, attributes: ['acctCode', 'acctName'] },
        { as: 'dataSource', model: postgres.DataSource, attributes: ['id', 'name'] }
      ],
      where = {};

    if (_.isEmpty(source) == false) {
      where['source'] = source;
    }
    if (_.isEmpty(model) == false) {
      where['model'] = model;
    }
    if (_.isEmpty(item) == false) {
      where['item'] = item;
    }

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, raw: true, nest: true });
    return { rows, offset, count, limit };
  };
}

export default AccountConfig;
