import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class AccountingModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'accountingModels',
      }
    );
  };

  static async finding({ term }) {
    const limit = PAGE_SIZE,
      order = [
        ['name', 'ASC'],
        ['id', 'ASC'],
      ],
      attributes = ['id', 'name'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        { [Op.substring]: _.toLower(term) }
      );
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default AccountingModel;
