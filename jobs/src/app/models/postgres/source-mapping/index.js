import _ from 'lodash';
import { postgres } from 'app/models'
import sequelize, { Model, DataTypes, Op, Sequelize } from 'sequelize';

class SourceMapping extends Model {
  static init(sequelize) {
    super.init(
      {
        source: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        name: DataTypes.STRING,
        itemSource: DataTypes.STRING,
        itemId: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'sourceMappings',
      }
    );
  };

  static associate(models) {
    this.hasMany(models.saleItems, { foreignKey: 'itemCode', sourceKey: 'id', as: 'items' });
  }

  static async listValidate({refDate}) {
    let where = { itemId: null, '$items->saleData.refDate$': refDate },
      attributes = ['source', 'id', 'name'],
      group = ['sourceMappings.source', 'sourceMappings.id', 'sourceMappings.name'],
      include = [{
         model: postgres.SaleItems,
         as: 'items',
         required: true,
         attributes: [],
         include: [{
          model: postgres.Sales,
          as: 'saleData',
          required: true,
          attributes: []
         }]
      }];
    return await this.findAll({ attributes, where, include, group })
  }

}

export default SourceMapping;
