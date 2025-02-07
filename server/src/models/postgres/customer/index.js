import _ from 'lodash';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        name: DataTypes.STRING,
        vatNumber: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        birthDate: DataTypes.STRING,
        street: DataTypes.STRING,
        streetNo: DataTypes.STRING,
        complement: DataTypes.STRING,
        neighborhood: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        country: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'customers'
      }
    );
  };

  static async finding({ term }) {
    const limit = PAGE_SIZE,
      order = [ ['name', 'ASC'] ],
      attributes = ['id', 'name', 'vatNumber'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.or] = [
        { 'vatNumber': { [Op.like]: `%${term}%` }},
        sequelize.where(sequelize.fn('lower', sequelize.col('name')),{ [Op.substring]: _.toLower(term) }),
      ]
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
};

export default Customer;
