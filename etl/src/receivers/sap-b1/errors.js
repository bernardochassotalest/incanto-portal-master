import _ from 'lodash'
import { md5 } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    const appId = _.get(content, 'AppId', ''),
        logDate = _.get(content, 'LogDate', ''),
        logTime = _.get(content, 'LogTime', '');

    logger(`SapB1 - ConciliationMessages: ${appId} - ${logDate} - ${logTime}`)
    const transaction = await postgres.ConciliationMessages.sequelize.transaction();

    try {
        const message = _.get(content, 'Message', ''),
            raw = {
                id: md5(`${appId}-${logDate}-${logTime}-${message}`),
                date: logDate,
                messageId: 'sapB1Error',
                sourceName: 'sapB1',
                sourceDb: 'sapB1',
                sourceId: '',
                memo: message,
                isActive: true
            };

        await postgres.ConciliationMessages.upsert(raw, { transaction });
        await transaction.commit();
        done()
    } catch(err) {
        logger(`Error saving ConciliationMessages: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.SapB1.Error.Post';

export { queue, register };
