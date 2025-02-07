import { Model, DataTypes } from 'sequelize';

class Sales extends Model {
  static init(sequelize) {
    super.init({
        id: { type: DataTypes.STRING, primaryKey: true },
        sourceName: DataTypes.STRING,
        sourceDb: DataTypes.STRING,
        sourceId: DataTypes.STRING,
        customerId: DataTypes.STRING,
        refDate: DataTypes.STRING,
        taxDate: DataTypes.STRING,
        dueDate: DataTypes.STRING,
        cancelDate: DataTypes.STRING,
        amount: DataTypes.DECIMAL(13, 2),
        status: DataTypes.STRING,
        tag: DataTypes.STRING,
        startPeriod: DataTypes.STRING,
        endPeriod: DataTypes.STRING,
        isCaptured: DataTypes.ENUM(['none', 'true', 'false']),
        isPecld: DataTypes.ENUM(['none', 'true', 'false']),
        isCredit: DataTypes.ENUM(['none', 'true', 'false']),
    },
    {
        sequelize, modelName: 'sales'
    });
  }
}

export default Sales;
