import { Model, DataTypes } from 'sequelize';

class AcquirerTransactions extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            acquirer: DataTypes.STRING,
            batchGroup: DataTypes.STRING,
            keyNsu: DataTypes.STRING,
            keyTid: DataTypes.STRING,
            tag: DataTypes.STRING,
            pointOfSale: DataTypes.STRING,
            batchNo: DataTypes.STRING,
            saleType: DataTypes.ENUM(['debito', 'credito']),
            captureDate: DataTypes.STRING,
            captureTime: DataTypes.STRING,
            grossAmount: DataTypes.DECIMAL(13, 2),
            rate: DataTypes.DECIMAL(13, 2),
            commission: DataTypes.DECIMAL(13, 2),
            netAmount: DataTypes.DECIMAL(13, 2),
            nsu: DataTypes.STRING,
            authorization: DataTypes.STRING,
            tid: DataTypes.STRING,
            reference: DataTypes.STRING,
            cardNumber: DataTypes.STRING,
            cardBrandCode: DataTypes.STRING,
            cardBrandName: DataTypes.STRING,
            captureType: DataTypes.STRING,
            terminalNo: DataTypes.STRING,
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            fileName: DataTypes.STRING,
            fileLine: DataTypes.INTEGER,
            saleId: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'acquirerTransactions'
        });
    }
}
export default AcquirerTransactions;

