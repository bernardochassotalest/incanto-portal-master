import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class AccountingModel extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        baseMemo: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'accountingModels',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.accountingModelGroups, { foreignKey: 'group', as: 'groupData' });
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
