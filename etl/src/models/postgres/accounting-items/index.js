import { Model, DataTypes } from 'sequelize';

class AccountingItems extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            refDate: DataTypes.STRING,
            taxDate: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            tag: DataTypes.STRING,
            accountItem: { type: DataTypes.STRING, allowNull: false },
            amount: DataTypes.DECIMAL(13, 2),
            pointOfSale: DataTypes.STRING,
            championshipId: DataTypes.STRING,
            matchId: DataTypes.STRING,
            jeId: DataTypes.STRING,
            debitLineId: DataTypes.STRING,
            creditLineId: DataTypes.STRING,
            extraMemo: DataTypes.STRING,
            timeLog: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'accountingItems'
        });
    }
}

export default AccountingItems;
