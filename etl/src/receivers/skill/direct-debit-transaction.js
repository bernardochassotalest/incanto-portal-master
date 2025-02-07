import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - DirectDebitTransaction: ${content.transaction.id} - ${content.occurrence.sourceId}`)
    const transaction = await postgres.DirectDebitTransactions.sequelize.transaction();

    try {
        let directDebit = _.get(content, 'transaction', {}),
            occurrence = _.get(content, 'occurrence', {}),
            contentT = _.pick(directDebit, ['id', 'keyCommon', 'crdBank', 'crdBranch', 'crdAccount', 'crdAcctDigit',
                                    'debBank', 'debBranch', 'debAccount', 'debAcctDigit', 'tag', 'debitNumber',
                                    'ourNumber', 'refDate', 'dueDate', 'amount', 'vatNumber', 'holderName']),
            contentO = _.pick(occurrence, ['id', 'transactionId', 'type', 'occurId', 'occurName', 'date', 'amount',
                                    'interest', 'balance', 'sourceDb', 'sourceId', 'fileName', 'fileLine', 'acctContent']),
            where = { id: _.get(contentT, 'id', '') },
            found = await postgres.DirectDebitTransactions.findOne({ where, transaction });

        contentT['saleId'] = '';
        if (_.isNumber(contentT.amount) == false) {
            contentT.amount = 0;
        }
        if (_.isNumber(contentO.amount) == false) {
            contentO.amount = 0;
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
          await postgres.DirectDebitTransactions.upsert(contentT, { transaction });
        }
        await postgres.DirectDebitOccurrences.upsert(contentO, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving DirectDebitTransaction: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.DirectDebitTransaction.Post';

export { queue, register };
