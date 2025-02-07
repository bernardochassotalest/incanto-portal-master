import { Model, DataTypes, Op } from 'sequelize';

class Matches extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            championshipId: DataTypes.STRING,
            name: DataTypes.STRING,
            date: DataTypes.STRING,
            time: DataTypes.STRING,
            opponent: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'matches'
        });
    }

    static async listForLink(ids) {
        const attributes = [
                ['id', 'Code'], 
                ['name', 'Name'], 
                ['date', 'Date'], 
                ['time', 'Time'],
                ['opponent', 'Opponent']
            ],
            where = {
                id: { [Op.in]: ids }
            };
        let { rows = [] } = await this.findAndCountAll({ where, attributes, raw: true });
        return rows
    }
}

export default Matches;

