import _ from 'lodash';
import { md5, leftString, getTimeLog } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - SaleAccountingBalance: ${content.id} - ${content.saleAccountingId}`)
    const transaction = await postgres.SaleAccountingBalances.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'saleAccountingId', 'type', 'balance']);

        if (_.isNumber(model.balance) == false) {
            model.balance = 0;
        }
        if (_.isEmpty(model.type) == true) {
            model.type = 'none';
        }
        await postgres.SaleAccountingBalances.upsert(model, { returning: false, transaction });
        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving SaleAccountingBalance: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.SaleAccountingBalance.Post';

export { queue, register };

