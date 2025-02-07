import { Model, DataTypes } from 'sequelize';
import moment from 'moment'
import _ from 'lodash';

class Pooling extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            periodType: DataTypes.STRING,
            startDate: DataTypes.STRING,
            startCycle: DataTypes.STRING,
            lastExecution: DataTypes.STRING,
            lastUrl: DataTypes.STRING,
            updatedAt: DataTypes.DATE
        }, { sequelize, modelName: 'poolings' });
    }

    static async getStart(id) {
        let attributes = ['periodType', 'startDate', 'startCycle'],
            where = { id: String(id) },
            result = { periodType: '', startDate: '1900-01-01', startCycle: '' };

        let data = await this.findOne({ where, attributes, raw: true });
        if (_.isEmpty(_.get(data, 'startDate', '')) == false) {
            result = data;
        }
        return result;
    }

    static async saveStart(id, periodType) {
        let model = {
                id: id,
                periodType: periodType || '',
                startDate: moment().format('YYYY-MM-DD'),
                startCycle: moment().format('HH'),
                lastExecution: moment().format('YYYY-MM-DD HH:mm:ss'),
                lastUrl: '',
                updatedAt: new Date()
            };
        await this.upsert(model)
    }

    static async saveLastDate(id, date) {
        let model = {
                id: id,
                periodType: '',
                startDate: date,
                startCycle: '',
                lastExecution: moment().format('YYYY-MM-DD HH:mm:ss'),
                lastUrl: '',
                updatedAt: new Date()
            };
        await this.upsert(model)
    }

}

export default Pooling;
