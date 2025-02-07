import { postgres } from 'app/models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class NewcSales extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      status: DataTypes.ENUM(['noCustomer', 'processed']),
      ownerId: DataTypes.STRING,
      coownerId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'newcSales'
    });
  }
}

export default NewcSales;
