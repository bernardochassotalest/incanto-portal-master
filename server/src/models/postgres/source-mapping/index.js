import _ from 'lodash';
import { postgres } from 'models';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class SourceMapping extends Model {
  static init(sequelize) {
    super.init(
      {
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
    this.belongsTo(models.dataSources, { foreignKey: 'source', as: 'dataSource' });
  };

  static async load({ id }) {
    const where = { id };
    const include = [
      {
        as: 'dataSource',
        model: postgres.DataSource,
        attributes: ['id', 'name'],
      },
    ];
    let result = await this.findOne({ where, include, raw: true, nest: true }),
        sourceItem = await postgres.SourceItem.findOne({where: { source: result.itemSource || '', id: result.itemId || '' }});
    return {...result, sourceItem}
  };

  static async list({ source, item, mapped, offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [['source', 'ASC'],['name', 'ASC']],
      attributes = ['source', 'id', 'name', 'itemSource', 'itemId', 'createdAt'],
      include = [
        {
          as: 'dataSource',
          model: postgres.DataSource,
          attributes: ['id', 'name'],
        },
      ],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(item)) {
      where['name'] = { [Op.iLike]: `%${item}%` }
    }
    if (!_.isEmpty(source)) {
      where['source'] = { [Op.in]: source };
    }
    if (_.toLower(_.toString(mapped)) == 'true') {
      where['itemSource'] = { [Op.ne]: null };
    }
    if (_.toLower(_.toString(mapped)) == 'false') {
      where['itemSource'] = { [Op.eq]: null };
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, raw: true, nest: true });

    for (let i = 0; i < rows.length; i++) {
      let item = rows[i];
      item.sourceItem = await postgres.SourceItem.findOne({where: { source: item.itemSource, id: item.itemId }});
    }

    return { rows, offset, count, limit };
  };
}

export default SourceMapping;
