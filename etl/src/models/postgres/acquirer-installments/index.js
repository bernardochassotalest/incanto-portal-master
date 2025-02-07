import { Model, DataTypes } from 'sequelize';

class AcquirerInstallments extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            transactionId: DataTypes.STRING,
            installment: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            transType: DataTypes.ENUM(['venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback']),
            grossAmount: DataTypes.DECIMAL(13, 2),
            rate: DataTypes.DECIMAL(13, 2),
            commission: DataTypes.DECIMAL(13, 2),
            netAmount: DataTypes.DECIMAL(13, 2),
            acctContent: DataTypes.JSON,
        },
        {
            sequelize, modelName: 'acquirerInstallments'
        });
    }
}
export default AcquirerInstallments;

