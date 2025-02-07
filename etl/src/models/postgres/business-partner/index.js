import { Model, DataTypes } from 'sequelize';

class BusinessPartner extends Model {
    static init(sequelize) {
        super.init({
            cardCode: { type: DataTypes.STRING, primaryKey: true },
            cardName: DataTypes.STRING,
            tradeName: DataTypes.STRING,
            type: DataTypes.STRING,
            vatNumber: DataTypes.STRING,
            grpCode: DataTypes.INTEGER,
            account: DataTypes.STRING,
            lastDate: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'businessPartners'
        });
    }


}

export default BusinessPartner;

