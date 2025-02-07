import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - SlipFee: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.SlipFees.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'keyCommon', 'bank', 'branch', 'account', 'digitAccount', 'tag', 'date',
                                     'feeNumber', 'amount', 'wallet', 'occurId', 'occurName', 'sourceDb', 'sourceId',
                                     'fileName', 'fileLine']);

        if (_.isNumber(model.amount) == false) {
            model.amount = 0;
        }
        if (_.isNumber(model.fileLine) == false) {
            model.fileLine = 0;
        }
        model.feeNumber = leftString(_.get(model, 'feeNumber', ''), 20);
        model.occurId = leftString(_.get(model, 'occurId', ''), 20);
        model.occurName = leftString(_.get(model, 'occurName', ''), 100);
        model.sourceDb = leftString(_.get(model, 'sourceDb', ''), 50);
        model.sourceId = leftString(_.get(model, 'sourceId', ''), 50);
        model.fileName = leftString(_.get(model, 'fileName', ''), 100);

        await postgres.SlipFees.upsert(model, { transaction });
        await transaction.commit();
        done()
    } catch(err) {
        logger(`Error saving SlipFee: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.SlipFee.Post';

export { queue, register };
