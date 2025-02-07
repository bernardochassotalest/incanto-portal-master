import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';
import { postgres } from 'models';
import { onlyNumbers } from 'commons/helper';

class BusinessPartners extends Model {
  static init(sequelize) {
    super.init(
      {
        cardCode: { type: DataTypes.STRING, primaryKey: true },
        cardName: DataTypes.STRING,
        tradeName: DataTypes.STRING,
        type: DataTypes.STRING,
        vatNumber: DataTypes.STRING,
        grpCode: DataTypes.INTEGER,
        account: DataTypes.STRING,
        lastDate: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'businessPartners',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.bpGroups, { foreignKey: 'grpCode', as: 'bpGroup' });
  };

  static async load({ cardCode }) {
    let where = { cardCode },
      include = [
        {
          as: 'bpGroup',
          model: postgres.BpGroups,
          attributes: ['grpCode', 'grpName'],
        },
      ];
    return await this.findOne({ where, include });
  };

  static async list(params) {
    let limit = PAGE_SIZE,
      offset = isNaN(params.offset) ? 0 : params.offset * 1,
      order = [['cardName', 'ASC']],
      attributes = ['cardCode', 'cardName', 'type', 'vatNumber', 'createdAt'],
      where = {},
      include = [
        {
          as: 'bpGroup',
          model: postgres.BpGroups,
          attributes: ['grpCode', 'grpName'],
        },
      ];

    if (params.cardName) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('cardName')), { [Op.substring]: _.toLower(params.cardName) });
    }
    if (params.vatNumber) {
      where['vatNumber'] = onlyNumbers(params.vatNumber);
    }
    if (params.type) {
      where['type'] = params.type;
    }
    if (params.groupId) {
      where['grpCode'] = params.groupId;
    }
    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order, include, distinct: true });
    return { rows, offset, count, limit };
  };

  static async finding({ term, grpCode }) {
    const limit = PAGE_SIZE,
      order = [
        ['cardName', 'ASC'],
        ['cardCode', 'ASC'],
      ],
      attributes = ['cardCode', 'cardName'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.or] = [
        { 'cardCode': { [Op.iLike]: `%${term}%` }},
        { 'vatNumber': { [Op.like]: `%${term}%` }},
        sequelize.where(sequelize.fn('lower', sequelize.col('cardName')),{ [Op.substring]: _.toLower(term) }),
      ]
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default BusinessPartners;
