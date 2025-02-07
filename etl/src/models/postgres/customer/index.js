import { Model, DataTypes } from 'sequelize';

class Customer extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            name: DataTypes.STRING,
            vatNumber: { type: DataTypes.STRING, allowNull: false },
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            birthDate: DataTypes.STRING,
            street: DataTypes.STRING,
            streetNo: DataTypes.STRING,
            complement: DataTypes.STRING,
            neighborhood: DataTypes.STRING,
            zipCode: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            country: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'customers'
        });
    }

    static async byVatNumber(vatNumber) {
        const where = { vatNumber }
        let model = await this.findOne({ where });
        return model
    }
}

export default Customer;
