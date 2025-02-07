import { postgres } from 'app/models'
import { Model, DataTypes, Op } from 'sequelize';

class AccountConfigs extends Model {
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
    this.hasMany(models.accountingItems, { foreignKey: 'accountItem', sourceKey: 'id', as: 'items' });
  };

  static async byKeys(model, source, item, date) {
    let where = { model, source, item },
      order = [['validFrom', 'DESC']];

    where['validFrom'] = { [Op.lte]: date };

    let result = await this.findOne({ where, order, raw: true });

    return result
  }

  static async listValidate({refDate}) {
    let where = { isActive: false, '$items.refDate$': refDate },
      attributes = ['source', 'id'],
      group = ['accountConfigs.source', 'accountConfigs.id'],
      include = [{
         model: postgres.AccountingItems,
         as: 'items',
         required: true,
         attributes: []
      }];
    return await this.findAll({ attributes, where, include, group })
  }
}

export default AccountConfigs;
