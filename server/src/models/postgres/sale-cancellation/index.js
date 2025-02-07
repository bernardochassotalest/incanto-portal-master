import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class SaleCancellation extends Model {
  static init(sequelize) {
    super.init(
      {
        saleId: { type: DataTypes.STRING, primaryKey: true },
        notes: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'saleCancellations'
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.sales, { foreignKey: 'saleId', as: 'sale' });
    this.belongsTo(models.users, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.cancellationModels, { foreignKey: 'modelId', as: 'model' });
  };
};

export default SaleCancellation;
