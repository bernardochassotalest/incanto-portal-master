import { Model, DataTypes } from 'sequelize';

class Conciliations extends Model {
  static init(sequelize) {
    super.init({
        date: { type: DataTypes.STRING, primaryKey: true },
        status: {
            type: DataTypes.ENUM('open', 'concilied', 'closed'),
            defaultValue: 'open'
        }
    },
    {
        sequelize, modelName: 'conciliations'
    });
  }
}

export default Conciliations;
