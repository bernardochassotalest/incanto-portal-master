import _ from 'lodash';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class ConciliationRules extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        group: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'conciliationRules',
      }
    );
  };

  static async finding({ startDate, endDate, canConciliation }) {
    const order = [ ['name', 'ASC'] ]
      , attributes = ['id', 'name']
      , rules = ['slip_capture', 'slip_canceled', 'direct_debit_capture', 'creditcard_capture'];

    if (canConciliation) {
      rules.push('slip_fee');
      rules.push('slip_settlement');
      rules.push('direct_debit_settlement');
      rules.push('creditcard_settlement');
    }

    const queryGroup = `
          (Select T1."rule"
           From "conciliationItems" T1
                LEFT  JOIN "conciliationKeys" T2 ON T2."conciliationItemId" = T1."id"
           Where T2."keyId" is null and T1."date" >= '${startDate}' and T1."date" <='${endDate}' and
                 T1."rule" in (${_.map(rules, (o) => `'${o}'`).join(', ')})
           Group By T1."rule")`
      , where = {
        id: { [Op.in]: sequelize.literal(queryGroup) }
      };
    return await this.findAll({ where, attributes, order });
  };
}

export default ConciliationRules;
