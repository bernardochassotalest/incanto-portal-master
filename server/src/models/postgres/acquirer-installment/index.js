import { Model, DataTypes } from 'sequelize';

class AcquirerInstallment extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      installment: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      transType: DataTypes.ENUM(['venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback']),
      grossAmount: DataTypes.DECIMAL(13, 2),
      rate: DataTypes.DECIMAL(13, 2),
      commission: DataTypes.DECIMAL(13, 2),
      netAmount: DataTypes.DECIMAL(13, 2),
    },
    {
      sequelize, modelName: 'acquirerInstallments'
    });
  };

  static associate(models) {
    this.belongsTo(models.acquirerTransactions, { foreignKey: 'transactionId', as: 'trsn' });
  };
}

export default AcquirerInstallment;
