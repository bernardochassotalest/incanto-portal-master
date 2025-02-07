import { Model, DataTypes, Op } from 'sequelize';

class AccountConfigs extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            model: { type: DataTypes.STRING, allowNull: false },
            source: { type: DataTypes.STRING, allowNull: false },
            item: { type: DataTypes.STRING, allowNull: false },
            validFrom: DataTypes.STRING,
            debAccount: { type: DataTypes.STRING, allowNull: false },
            debShortName: DataTypes.STRING,
            debCostingCenter: DataTypes.STRING,
            debProject: DataTypes.STRING,
            crdAccount: { type: DataTypes.STRING, allowNull: false },
            crdShortName: DataTypes.STRING,
            crdCostingCenter: DataTypes.STRING,
            crdProject: DataTypes.STRING,
            isActive: DataTypes.BOOLEAN,
        },
        {
            sequelize, modelName: 'accountConfigs'
        });
    }

    static async byKeys(model, source, item, date) {
        let where = { model, source, item },
            order = [['validFrom', 'DESC']];

        where['validFrom'] = { [Op.lte]: date };

        let result = await this.findOne({ where, order, raw: true });
        
        return result
    }
}

export default AccountConfigs;
