import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - SlipTransaction: ${content.transaction.id} - ${content.occurrence.sourceId}`)
    const transaction = await postgres.SlipTransactions.sequelize.transaction();

    try {
        let slip = _.get(content, 'transaction', {}),
            occurrence = _.get(content, 'occurrence', {}),
            contentT = _.pick(slip, ['id', 'bank', 'keyCommon', 'branch', 'account', 'digitAccount', 'tag',
                                     'slipNumber', 'ourNumber', 'digitOurNumber', 'reference', 'wallet',
                                     'kind', 'refDate', 'dueDate', 'amount', 'holderName']),
            contentO = _.pick(occurrence, ['id', 'transactionId', 'type', 'occurId', 'occurName',
                                           'paidPlace', 'date', 'amount', 'discount', 'interest',
                                           'balance','sourceDb', 'sourceId', 'fileName', 'fileLine', 'acctContent']),
            where = { id: _.get(contentT, 'id', '') },
            found = await postgres.SlipTransactions.findOne({ where, transaction });

        contentT['saleId'] = '';
        if (_.isNumber(contentT.amount) == false) {
            contentT.amount = 0;
        }
        if (_.isNumber(contentO.amount) == false) {
            contentO.amount = 0;
        }
        if (_.isNumber(contentO.discount) == false) {
            contentO.discount = 0;
        }
        if (_.isNumber(contentO.interest) == false) {
            contentO.interest = 0;
        }
        if (_.isNumber(contentO.balance) == false) {
            contentO.balance = 0;
        }
        if (_.isNumber(contentO.fileLine) == false) {
            contentO.fileLine = 0;
        }
        contentO.fileName = leftString(_.get(contentO, 'fileName', ''), 100);

        if (!found) {
          await postgres.SlipTransactions.upsert(contentT, { transaction });
        }
        await postgres.SlipOccurrences.upsert(contentO, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving SlipTransaction: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.SlipTransaction.Post';

export { queue, register };
