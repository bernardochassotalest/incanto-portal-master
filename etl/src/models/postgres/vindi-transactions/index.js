import { Model, DataTypes } from 'sequelize';

class VindiTransactions extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            chargeId: DataTypes.STRING,
            transactionType: DataTypes.STRING,
            status: DataTypes.STRING,
            createDate: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            paidDate: DataTypes.STRING,
            paymentMethod: DataTypes.STRING,
            authorization: DataTypes.STRING,
            tid: DataTypes.STRING,
            nsu: DataTypes.STRING,
            amount: DataTypes.DECIMAL(13, 2),
            content: DataTypes.JSON,
        },
        {
            sequelize, modelName: 'vindiTransactions'
        });
    }
}

export default VindiTransactions;
