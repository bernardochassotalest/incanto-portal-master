import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class ReportTemplateItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        father: DataTypes.STRING,
        level: DataTypes.INTEGER,
        order: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: 'reportTemplateItems',
        hooks: {
          beforeCreate: this.hasBeforeCreate,
        }
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.reportTemplates, { foreignKey: 'templateId', as: 'template' });
    this.hasMany(models.reportTemplateAccounts, { foreignKey: 'templateItemId', sourceKey: 'id', as: 'accounts' });
  };

  static hasBeforeCreate(model) {
    model.id = uuidv4();
  };
};

export default ReportTemplateItem;
