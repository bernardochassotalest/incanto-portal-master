import { Model, DataTypes } from 'sequelize';

class SlipTransactions extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            bank: DataTypes.STRING,
            keyCommon: DataTypes.STRING,
            branch: DataTypes.STRING,
            account: DataTypes.STRING,
            digitAccount: DataTypes.STRING,
            tag: DataTypes.STRING,
            slipNumber: DataTypes.STRING,
            ourNumber: DataTypes.STRING,
            digitOurNumber: DataTypes.STRING,
            reference: DataTypes.STRING,
            wallet: DataTypes.STRING,
            kind: DataTypes.STRING,
            refDate: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            amount: DataTypes.DECIMAL(13, 2),
            holderName: DataTypes.STRING,
            saleId: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'slipTransactions'
        });
    }
}

export default SlipTransactions;
