import { Model, DataTypes } from 'sequelize';

class ConciliationKeys extends Model {
    static init(sequelize) {
        super.init({
            conciliationItemId: { type: DataTypes.STRING, primaryKey: true },
            keyId: DataTypes.STRING,
            notes: DataTypes.STRING,
            isManual: DataTypes.ENUM(['none', 'true', 'false']),
        },
        {
            sequelize, modelName: 'conciliationKeys'
        });
    }

    static associate(models) {
        this.belongsTo(models.conciliationItems, { foreignKey: 'id', as: 'item' });
        this.belongsTo(models.users, { foreignKey: 'userId', as: 'userData' });
    }
}

export default ConciliationKeys;
