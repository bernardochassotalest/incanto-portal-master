import { Model, DataTypes } from 'sequelize';

class PaymentChecks extends Model {
    static init(sequelize) {
        super.init({
            paymentId: { type: DataTypes.STRING, primaryKey: true },
            bank: DataTypes.STRING,
            branch: DataTypes.STRING,
            account: DataTypes.STRING,
            chkNumber: DataTypes.STRING,
            holderName: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'paymentChecks'
        });
    }
}

export default PaymentChecks;
