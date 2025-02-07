import { Model, DataTypes, Op, Sequelize } from 'sequelize';
import _ from 'lodash';

class AccountingItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        sourceDb: DataTypes.STRING,
        sourceId: DataTypes.STRING,
        refDate: DataTypes.STRING,
        taxDate: DataTypes.STRING,
        dueDate: DataTypes.STRING,
        tag: DataTypes.STRING,
        amount: DataTypes.DECIMAL(13, 2),
        pointOfSale: DataTypes.STRING,
        championshipId: DataTypes.STRING,
        matchId: DataTypes.STRING,
        extraMemo: DataTypes.STRING,
        timeLog: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'accountingItems',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.accountConfigs, { foreignKey: 'accountItem', as: 'accountConfig' });
    this.belongsTo(models.journalVouchers, { foreignKey: 'jeId', as: 'journalVoucher' });
    this.belongsTo(models.acquirerInstallments, { foreignKey: 'sourceId', as: 'acqrIns' });
    this.hasMany(models.saleAccountings, { foreignKey: 'accountingItemId', sourceKey: 'id', as: 'saleAcct' });
  };
};

export default AccountingItem;
