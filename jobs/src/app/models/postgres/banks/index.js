import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class Banks extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        nick: DataTypes.STRING,
        ispb: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'banks',
      }
    );
  };
}

export default Banks;
