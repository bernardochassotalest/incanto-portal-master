import _ from 'lodash';
import sequelize, { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'models';

class ConciliationAccounts extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      type: DataTypes.ENUM(['none', 'account', 'finance']),
    },
    {
      sequelize, modelName: 'conciliationAccounts'
    });
  }

  static associate(models) {
    this.belongsTo(models.chartOfAccounts, { foreignKey: 'acctCode', as: 'chartOfAccount' });
    this.belongsTo(models.businessPartners, { foreignKey: 'cardCode', as: 'businessPartner' });
  }

  static async load({ id }) {
    const where = { id };
    const include = [
      { required: false, as: 'chartOfAccount', model: postgres.ChartOfAccounts, attributes: ['acctCode', 'acctName', 'lockManual'] },
      { required: false, as: 'businessPartner', model: postgres.BusinessPartners, attributes: ['cardCode', 'cardName'] },
    ];
    let result = await this.findOne({ where, include });
    return result;
  };

  static async list({ offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [['id', 'ASC']],
      attributes = ['id', 'type'],
      include = [
        { as: 'chartOfAccount', model: postgres.ChartOfAccounts, attributes: ['acctCode', 'acctName'] },
        { as: 'businessPartner', model: postgres.BusinessPartners, attributes: ['cardCode', 'cardName'] },
      ],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        { [Op.substring]: _.toLower(term) }
      );
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, raw: true, nest: true });
    return { rows, offset, count, limit };
  };
}

export default ConciliationAccounts;
