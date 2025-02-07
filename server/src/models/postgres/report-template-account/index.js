import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class ReportTemplateAccount extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        order: DataTypes.INTEGER,
        value: DataTypes.VIRTUAL,
      },
      {
        sequelize,
        modelName: 'reportTemplateAccounts',
        hooks: {
          beforeCreate: this.hasBeforeCreate,
        }
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.reportTemplateItems, { foreignKey: 'templateItemId', as: 'templateItem' });
    this.belongsTo(models.reportTemplates, { foreignKey: 'templateId', as: 'template' });
    this.belongsTo(models.chartOfAccounts, { foreignKey: 'account', as: 'accountData' });
  };

  static hasBeforeCreate(model) {
    model.id = uuidv4();
  };
};

export default ReportTemplateAccount;
