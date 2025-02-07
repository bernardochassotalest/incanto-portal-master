import sequelize, { Model, DataTypes, Op } from 'sequelize';

class ReportTypes extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'reportTypes'
    });
  }

  static associate(models) {
    this.hasMany(models.reportRequests, { foreignKey: 'typeId', as: 'requestsData' });
  }

}

export default ReportTypes;
