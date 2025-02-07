import { Model, DataTypes } from 'sequelize';

class SalePayments extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            sourceName: DataTypes.STRING,
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            saleId: DataTypes.STRING,
            tag: DataTypes.STRING,
            refDate: DataTypes.STRING,
            taxDate: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            amount: DataTypes.DECIMAL(13, 2),
            status: DataTypes.ENUM(['pending', 'paid', 'canceled']),
            type: DataTypes.ENUM(['none', 'creditcard', 'slip', 'bankDebit', 'check', 'money', 'balance']),
            isConcilied: DataTypes.BOOLEAN,
            timeLog: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'salePayments'
        });
    }
}

export default SalePayments;
