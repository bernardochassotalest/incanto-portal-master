import _ from 'lodash'
import { md5 } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres, mongodb}, data:{content}}) => {
    logger(`Multiclubes - FinancialLog: ${content.EventDate}`)

    try {
        let eventDate = _.get(content, 'EventDate', '');

        await postgres.Pooling.saveLastDate('multiclubes-financial-log', eventDate);

        done();
    } catch(err) {
        logger(`Error saving Multiclubes-FinancialLog: ${err}`);
        throw err;
    }

}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Multiclubes.FinancialLog.Post';

export { queue, register };
