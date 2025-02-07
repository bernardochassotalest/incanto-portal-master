import { Model, DataTypes } from 'sequelize';

class AcquirerSettlements extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      installment: DataTypes.STRING,
      transType: DataTypes.ENUM(['liquidacao', 'antecipacao', 'taxa_administracao', 'taxa_antecipacao', 'cancelamento', 'chargeback', 'ajuste_a_debito', 'ajuste_a_credito']),
      dueDate: DataTypes.STRING,
      paidDate: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      notes: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      accountingItemId: DataTypes.STRING,
      saleAccountingId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'acquirerSettlements'
    });
  };

  static associate(models) {
    this.belongsTo(models.acquirerTransactions, { foreignKey: 'transactionId', as: 'trsn' });
    this.hasOne(models.accountingItems, { foreignKey: 'id', sourceKey: 'accountingItemId', as: 'acctData' });
    this.hasOne(models.saleAccountings, { foreignKey: 'id', sourceKey: 'saleAccountingId', as: 'saleAcct' });
  };
}

export default AcquirerSettlements;
