import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class AccountingModels extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        group: DataTypes.STRING,
        baseMemo: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'accountingModels',
      }
    );
  };

  static async list() {
    const attributes = ['id', 'name', 'group'];

    let { rows = [] } = await this.findAndCountAll({ attributes, raw: true });

    return rows;
  };
}

export default AccountingModels;
