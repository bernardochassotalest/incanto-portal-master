import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - BankStatement: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.BankStatements.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'bank', 'branch', 'account', 'digitAccount', 'date',
                                     'debit', 'credit', 'balance', 'category', 'cashFlow', 'notes',
                                     'acquirer', 'pointOfSale', 'conciliationType', 'keyCommon',
                                     'sourceDb', 'sourceId', 'fileName', 'fileLine']);

        if (_.isNumber(model.debit) == false) {
            model.debit = 0;
        }
        if (_.isNumber(model.credit) == false) {
            model.credit = 0;
        }
        if (_.isNumber(model.balance) == false) {
            model.balance = 0;
        }
        if (_.isNumber(model.fileLine) == false) {
            model.fileLine = 0;
        }
        model.fileName = leftString(_.get(model, 'fileName', ''), 100);
        model.notes = leftString(_.get(model, 'notes', ''), 200);

        await postgres.BankStatements.upsert(model, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving BankStatement: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.BankStatement.Post';

export { queue, register };
