import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { postgres } from 'models'

class ReportTemplate extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        type: DataTypes.ENUM([ 'balance_sheet', 'trial_balance', 'profit_loss' ]),
        tag: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'reportTemplates',
        hooks: {
          beforeCreate: this.hasBeforeCreate,
        }
      }
    );
  };

  static associate(models) {
    this.hasMany(models.reportTemplateItems, { foreignKey: 'templateId', sourceKey: 'id', as: 'items' });
  };

  static hasBeforeCreate(model) {
    model.id = uuidv4();
  };

  static async load({ id }, user) {
    let where = { id },
      include = [
        {
          model: postgres.ReportTemplateItem,
          as: 'items',
          include: [
            {
              model: postgres.ReportTemplateAccount,
              as: 'accounts',
              include: [
                { model: postgres.ChartOfAccounts, as: 'accountData' }
              ]
            }
          ]
        }
      ];
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }
    return await this.findOne({ where, include });
  };

  static async list({ offset = 0, term }, user) {
    let limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'name', 'createdAt'],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('name')),{ [Op.substring]: _.toLower(term) });
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order });
    return { rows, offset, count, limit };
  };

  static async finding({ term }, user) {
    const limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'name', 'type'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('name')), { [Op.substring]: _.toLower(term) });
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }
    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
};

export default ReportTemplate;
