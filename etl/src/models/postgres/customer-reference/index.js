import { Model, DataTypes } from 'sequelize';

class CustomerReference extends Model {
  static init(sequelize) {
    super.init({
        id: { type: DataTypes.STRING, primaryKey: true },
        customerId: DataTypes.STRING,
        sourceName: DataTypes.STRING,
        sourceDb: DataTypes.STRING,
        sourceId: DataTypes.STRING
    },
    {
        sequelize, modelName: 'customerReferences'
    });
  }
}

export default CustomerReference;
