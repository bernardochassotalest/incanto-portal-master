import _ from 'lodash';
import { md5, leftString, getTimeLog } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - AcquirerSettlement: ${content.id} - ${content.transactionId}`)
    const transaction = await postgres.AcquirerSettlements.sequelize.transaction();

    try {
        let saleId = _.get(content, 'saleId', '');
        let model = _.pick(content, ['id', 'transactionId', 'installment', 'transType', 'dueDate', 'paidDate',
                                     'amount', 'notes', 'fileName', 'fileLine', 'accountingItemId', 'saleAccountingId']);

        if (_.isNumber(model.amount) == false) {
            model.amount = 0;
        }
        if (_.isNumber(model.fileLine) == false) {
            model.fileLine = 0;
        }
        model.notes = leftString(_.get(model, 'notes', ''), 100);
        model.fileName = leftString(_.get(model, 'fileName', ''), 100);
        if (_.isEmpty(model.accountingItemId) == true) {
            model.accountingItemId = '';
        }
        if (_.isEmpty(model.saleAccountingId) == true) {
            model.saleAccountingId = '';
        }

        await postgres.AcquirerSettlements.upsert(model, { transaction });

        if (_.isEmpty(saleId) == false) {
            let saleAcct = {
                    id: model.saleAccountingId,
                    saleId: saleId,
                    accountingItemId: model.accountingItemId,
                    amount: model.amount,
                    timeLog: getTimeLog()
                },
                type = 'creditCard',
                saleBalance = {
                    id: md5(`${model.saleAccountingId}-${type}`),
                    saleAccountingId: model.saleAccountingId,
                    type: type,
                    balance: (-1 * model.amount)
                };
            await postgres.SaleAccountings.upsert(saleAcct, { transaction });
            await postgres.SaleAccountingBalances.upsert(saleBalance, { transaction });
        }

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving AcquirerSettlement: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.AcquirerSettlement.Post';

export { queue, register };
