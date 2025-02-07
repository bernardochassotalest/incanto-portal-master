import { Model, DataTypes } from 'sequelize';

class PointOfSales extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            acquirer: DataTypes.STRING,
            code: DataTypes.STRING,
            tag: DataTypes.STRING,
        },
        {
            sequelize, modelName: 'pointOfSales'
        });
    }

    static async loadAll() {
        const attributes = ['acquirer', 'code', 'tag'];
        let { rows = [] } = await this.findAndCountAll({ attributes, raw: true });
        return rows
    }
}

export default PointOfSales;

