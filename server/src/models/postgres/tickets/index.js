import { Model, DataTypes } from 'sequelize';

class Tickets extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            saleItemId: DataTypes.STRING,
            matchId: DataTypes.STRING,
            priceTreshold: DataTypes.DECIMAL(13, 2),
            fee: DataTypes.DECIMAL(13, 2),
            attendenceDate: DataTypes.STRING,
            gate: DataTypes.STRING,
            area: DataTypes.STRING,
            sector: DataTypes.STRING,
            row: DataTypes.STRING,
            seat: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'tickets'
        });
    }
}

export default Tickets;
