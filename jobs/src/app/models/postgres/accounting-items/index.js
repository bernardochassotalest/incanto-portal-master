import _ from 'lodash';
import { postgres } from 'app/models';
import accountingConfig from 'config/accounting';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class AccountingItems extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      taxDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      tag: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      debitLineId: DataTypes.STRING,
      creditLineId: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      extraMemo: DataTypes.STRING,
      timeLog: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'accountingItems'
    });
  }

  static associate(models) {
    this.belongsTo(models.conciliations, { foreignKey: 'refDate', sourceKey: 'date', as: 'conciliationData' });
    this.belongsTo(models.journalVouchers, { foreignKey: 'jeId', as: 'journalVoucher' });
    this.belongsTo(models.championships, { foreignKey: 'championshipId', as: 'championshipData' });
    this.belongsTo(models.matches, { foreignKey: 'matchId', as: 'matchData' });
    this.belongsTo(models.accountConfigs, { foreignKey: 'accountItem', as: 'accountingData' });
    this.belongsTo(models.saleItems, { sourceKey: 'id', foreignKey: 'sourceId', as: 'saleItemRef' });
    this.belongsTo(models.salePayments, { sourceKey: 'id', foreignKey: 'sourceId', as: 'salePayRef' });
    this.belongsTo(models.slipOccurrences, { sourceKey: 'id', foreignKey: 'sourceId', as: 'slipRef' });
    this.belongsTo(models.acquirerBatches, { sourceKey: 'id', foreignKey: 'sourceId', as: 'batchRef' });
    this.belongsTo(models.acquirerInstallments, { sourceKey: 'id', foreignKey: 'sourceId', as: 'cardRef' });
    this.belongsTo(models.vindiIssues, { sourceKey: 'id', foreignKey: 'sourceId', as: 'vindiRef' });
    this.hasOne(models.sales, { sourceKey: 'sourceId', foreignKey: 'sourceId', as: 'saleRef' });
  };

  static async countAccounting(refDate) {
    let where = { refDate };
    where[Op.or] = [
      { debitLineId: null },
      { creditLineId: null }
    ]
    return await this.count({ where });
  };

  static async list({refDate}) {
    let where = {
        refDate: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lte]: refDate
        },
        [Op.or]: [
          { '$journalVoucher.status$': null },
          { '$journalVoucher.status$': 'pending' }
        ]
      },
      attributes = ['id', 'refDate', 'taxDate', 'dueDate', 'amount', 'tag', 'pointOfSale', 'championshipId',
                    'matchId', 'extraMemo', 'jeId'],
      include = [{
          model: postgres.AccountConfigs,
          as: 'accountingData',
          required: true,
          attributes: ['model', 'debAccount', 'debShortName', 'debCostingCenter', 'debProject',
                       'crdAccount', 'crdShortName', 'crdCostingCenter', 'crdProject'],
          where: { isActive: true },
          include: [{
              model: postgres.AccountingModel,
              as: 'accountingModel',
              required: true,
              attributes: ['group','baseMemo']
            }
          ]
        }, {
          model: postgres.Conciliations,
          as: 'conciliationData',
          required: true,
          attributes: ['date'],
          where: {
            status: {
              [Op.in]: ['concilied','closed']
            }
          }
        }, {
          model: postgres.JournalVouchers,
          as: 'journalVoucher',
          required: false,
          attributes: []
        }
      ],
      order = [['jeId', 'ASC'], ['accountingData', 'model', 'ASC']];

    return await this.findAll({ attributes, where, include, order })
  }
}

export default AccountingItems;
