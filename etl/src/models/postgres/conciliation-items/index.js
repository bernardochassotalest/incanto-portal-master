import _ from 'lodash'
import { Model, DataTypes, Op, literal } from 'sequelize';

class ConciliationItems extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            date: DataTypes.STRING,
            rule: DataTypes.STRING,
            sourceName: DataTypes.STRING,
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            pointOfSale: DataTypes.STRING,
            keyCommon: DataTypes.STRING,
            keyTid: DataTypes.STRING,
            keyNsu: DataTypes.STRING,
            credit: DataTypes.DECIMAL(13, 2),
            debit: DataTypes.DECIMAL(13, 2),
            balance: DataTypes.DECIMAL(13, 2),
        },
        {
            sequelize, modelName: 'conciliationItems'
        });
    }

    static associate(models) {
        this.hasOne(models.conciliationKeys, { sourceKey: 'id', foreignKey: 'conciliationItemId', as: 'keys' });
    }
}

export default ConciliationItems;

