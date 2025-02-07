import { Model, DataTypes } from 'sequelize';

class AcquirerBatches extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            acquirer: DataTypes.STRING,
            batchGroup: DataTypes.STRING,
            batchSource: DataTypes.STRING,
            group: DataTypes.ENUM(['venda', 'liquidacao', 'saldo']),
            type: DataTypes.ENUM(['venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback', 'aluguel_equipamentos', 'ajuste_a_credito', 'ajuste_a_debito', 'saldo_inicial']),
            plan: DataTypes.ENUM(['avista', 'rotativo', 'parcelado']),
            tag: DataTypes.STRING,
            pointOfSale: DataTypes.STRING,
            batchNo: DataTypes.STRING,
            operationNo: DataTypes.STRING,
            refDate: DataTypes.STRING,
            taxDate: DataTypes.STRING,
            dueDate: DataTypes.STRING,
            payDate: DataTypes.STRING,
            cardBrandCode: DataTypes.STRING,
            cardBrandName: DataTypes.STRING,
            installment: DataTypes.STRING,
            qtyTransactions: DataTypes.INTEGER,
            qtyRejections: DataTypes.INTEGER,
            bankCode: DataTypes.STRING,
            bankBranch: DataTypes.STRING,
            bankAccount: DataTypes.STRING,
            notes: DataTypes.STRING,
            grossAmount: DataTypes.DECIMAL(13, 2),
            rate: DataTypes.DECIMAL(13, 2),
            commission: DataTypes.DECIMAL(13, 2),
            netAmount: DataTypes.DECIMAL(13, 2),
            adjustment: DataTypes.DECIMAL(13, 2),
            fee: DataTypes.DECIMAL(13, 2),
            settlement: DataTypes.DECIMAL(13, 2),
            rejectAmount: DataTypes.DECIMAL(13, 2),
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            fileName: DataTypes.STRING,
            fileLine: DataTypes.INTEGER,
        },
        {
            sequelize, modelName: 'acquirerBatches'
        });
    }
}

export default AcquirerBatches;
