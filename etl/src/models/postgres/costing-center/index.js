import { Model, DataTypes } from 'sequelize';

class CostingCenter extends Model {
  static init(sequelize) {
    super.init({
        ocrCode: { type: DataTypes.STRING, primaryKey: true },
        ocrName: DataTypes.STRING,
        locked: DataTypes.BOOLEAN,
    }, { sequelize, modelName: 'costingCenters' });
  }
}

export default CostingCenter;
