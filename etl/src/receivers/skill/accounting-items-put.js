import _ from 'lodash';
import axios from 'axios'
import { delay } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - AccountingItems - PUT: ${content.id}`)
    const transaction = await postgres.AccountingItems.sequelize.transaction();

    try {
        let id = _.get(content, 'id', ''),
            debitLineId = _.get(content, 'debitLineId', ''),
            creditLineId = _.get(content, 'creditLineId', ''),
            url = _.get(content, 'url', '');

        if (_.isEmpty(id) == false) {
            await postgres.AccountingItems.update({ debitLineId, creditLineId }, { where: { id }, transaction });
        }
        await transaction.commit();

        if (_.isEmpty(url) == false) {
          await delay(2000);
          await axios.post(url, {});
        }

        done()
    } catch(err) {
        logger(`Error saving AccountingItems: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.AccountingItems.Put';

export { queue, register };
