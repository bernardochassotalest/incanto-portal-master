import { Model, DataTypes } from 'sequelize';

class VindiCharges extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            billId: DataTypes.STRING,
            status: DataTypes.STRING,
            issuedDate: DataTypes.STRING,
            createDate: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            paidDate: DataTypes.STRING,
            paymentMethod: DataTypes.STRING,
            amount: DataTypes.DECIMAL(13, 2),
            content: DataTypes.JSON,
        },
        {
            sequelize, modelName: 'vindiCharges'
        });
    }

    static associate(models) {
        this.hasMany(models.vindiTransactions, { foreignKey: 'chargeId', sourceKey: 'id', as: 'transactions' });
    }

    static async getForPayments(transaction) {
        const attributes = [
                ['billId', 'billId'], 
                ['id', 'chargeId'], 
                ['amount', 'amount'], 
                ['content', 'payment']
            ],
            include = [ {
                association: 'transactions',
                required: false,
                attributes: [ ['id', 'transactionId'], ['content', 'extra'] ],
            }],
            order = ['billId', 'id', ['transactions', 'id', 'ASC']];
        let { rows = [] } = await this.findAndCountAll({ attributes, include, order, raw: true }, { transaction });
        return rows
    }
}

export default VindiCharges;
