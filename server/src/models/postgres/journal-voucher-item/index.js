import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class JournalVoucherItem extends Model {
  static init(sequelize) {
    super.init(
      {
        lineId: { type: DataTypes.STRING, primaryKey: true },
        debit: DataTypes.DECIMAL(13, 2),
        credit: DataTypes.DECIMAL(13, 2),
        balance: DataTypes.DECIMAL(13, 2),
        memo: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'journalVoucherItems',
        hooks: {}
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.journalVouchers, { foreignKey: 'jeId', as: 'journalVoucher' });
    this.belongsTo(models.businessPartners, { foreignKey: 'shortName', as: 'businessPartner' });
    this.belongsTo(models.chartOfAccounts, { foreignKey: 'account', as: 'accountData' });
    this.belongsTo(models.costingCenters, { foreignKey: 'costingCenter', as: 'costingCenterData' });
    this.belongsTo(models.projects, { foreignKey: 'project', as: 'projectData' });
  };

  static async listBase(ids) {
    let where = {
        jeId: { [Op.in]: ids }
      },
      attributes = ['jeId', 'lineId', 'memo'],
      include = [{
        model: postgres.ChartOfAccounts,
        as: 'accountData',
        attributes: ['acctCode', 'acctName']
       },{
        model: postgres.BusinessPartners,
        as: 'businessPartner',
        attributes: ['cardCode', 'cardName']
      }];

    return await this.findAll({where, attributes, include });
  };

};

export default JournalVoucherItem;
