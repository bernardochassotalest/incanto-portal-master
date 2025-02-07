import { Model, DataTypes } from 'sequelize';

class BankStatements extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            bank: DataTypes.STRING,
            branch: DataTypes.STRING,
            account: DataTypes.STRING,
            digitAccount: DataTypes.STRING,
            date: DataTypes.STRING,
            debit: DataTypes.DECIMAL(13, 2),
            credit: DataTypes.DECIMAL(13, 2),
            balance: DataTypes.DECIMAL(13, 2),
            category: DataTypes.STRING,
            cashFlow: DataTypes.STRING,
            notes: DataTypes.STRING,
            acquirer: DataTypes.STRING,
            pointOfSale: DataTypes.STRING,
            keyCommon: DataTypes.STRING,
            conciliationType: DataTypes.ENUM(['none', 'creditcard', 'slip', 'directDebit']),
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            fileName: DataTypes.STRING,
            fileLine: DataTypes.INTEGER,
        },
        {
            sequelize, modelName: 'bankStatements'
        });
    }
}
export default BankStatements;
