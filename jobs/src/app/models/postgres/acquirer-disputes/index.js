import { Model, DataTypes } from 'sequelize';

class AcquirerDisputes extends Model {
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
            saleDate: DataTypes.STRING,
            endDate: DataTypes.STRING,
            processNo: DataTypes.STRING,
            reference: DataTypes.STRING,
            nsu: DataTypes.STRING,
            authorization: DataTypes.STRING,
            tid: DataTypes.STRING,
            amount: DataTypes.DECIMAL(13, 2),
            cardNumber: DataTypes.STRING,
            cardBrandCode: DataTypes.STRING,
            cardBrandName: DataTypes.STRING,
            notes: DataTypes.STRING,
            sourceDb: DataTypes.STRING,
            sourceId: DataTypes.STRING,
            fileName: DataTypes.STRING,
            fileLine: DataTypes.INTEGER,
            saleId: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'acquirerDisputes'
        });
    }
}
export default AcquirerDisputes;
