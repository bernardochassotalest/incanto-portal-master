import { Model, DataTypes } from 'sequelize';

class Project extends Model {
  static init(sequelize) {
    super.init({
        prjCode: { type: DataTypes.STRING, primaryKey: true },
        prjName: DataTypes.STRING
    }, { sequelize, modelName: 'projects' });
  }
}

export default Project;
