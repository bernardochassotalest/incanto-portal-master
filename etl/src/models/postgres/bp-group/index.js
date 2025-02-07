import { Model, DataTypes } from 'sequelize';

class BpGroup extends Model {
  static init(sequelize) {
    super.init({
        grpCode: { type: DataTypes.INTEGER, primaryKey: true },
        grpName: DataTypes.STRING
    }, { sequelize, modelName: 'bpGroups' });
  }
}

export default BpGroup;
