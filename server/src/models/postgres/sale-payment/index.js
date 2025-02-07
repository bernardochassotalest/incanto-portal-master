import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class SalePayment extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        sourceName: DataTypes.STRING,
        sourceDb: DataTypes.STRING,
        refDate: DataTypes.STRING,
        taxDate: DataTypes.STRING,
        dueDate: DataTypes.STRING,
        amount: DataTypes.DECIMAL(13, 2),
        isConcilied: DataTypes.BOOLEAN,
        timeLog: DataTypes.STRING,
        status: DataTypes.ENUM(['pending', 'paid', 'canceled']),
        type: DataTypes.ENUM(['none', 'creditcard', 'slip', 'bankDebit', 'check', 'money', 'balance']),
      },
      {
        sequelize,
        modelName: 'salePayments'
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.sales, { foreignKey: 'saleId', as: 'sale' });
    this.belongsTo(models.dataSources, { foreignKey: 'sourceId', as: 'source' });
    this.belongsTo(models.tags, { foreignKey: 'tag', as: 'tagData' });
    this.hasOne(models.paymentSlips, { foreignKey: 'paymentId', as: 'slip' });
    this.hasOne(models.paymentDirectDebits, { foreignKey: 'paymentId', as: 'directDebit' });
    this.hasOne(models.paymentCreditcards, { foreignKey: 'paymentId', as: 'cards' });
  };
};

export default SalePayment;


