import _ from 'lodash';
import { md5 } from '../../lib/utils';

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - SalePayments: ${content.billId} - ${content.chargeId}`)
    const transaction = await postgres.SalePayments.sequelize.transaction();

    try {
        let item = content, type = 'none',
            billId = _.get(item, 'billId', ''),
            chargeId = _.get(item, 'chargeId', ''),
            transactionId = _.get(item, 'transactions.transactionId', ''),
            extra = _.get(item, 'transactions.extra', {}),
            amount = _.get(item, 'amount', 0),
            paymentId = `${billId}-${chargeId}`,
            payment = JSON.parse(item.payment);
        if (transactionId) {
            extra = JSON.parse(extra)
            paymentId += _.toString(transactionId)
            amount = _.get(extra, 'amount', 0);
            type = _.get(extra, 'type', '');
            payment['sourceDb'] = 'vindiTransactions';
            payment['sourceId'] = transactionId;
        }
        paymentId = md5(paymentId)

        let model = { id: paymentId, amount, ...payment };
        model['type'] = type;
        await postgres.SalePayments.upsert(model, { transaction });

        if (_.isEmpty(extra) == false) {
            if (type === 'slip') {
                let data = _.get(extra, 'slip', {}),
                    slip = { paymentId,  ...data};
                await postgres.PaymentSlips.upsert(slip, { transaction });
            } else if (type === 'directDebit') {
                let data = _.get(extra, 'directDebit', {}),
                    directDebit = { paymentId,  ...data};
                await postgres.PaymentDirectDebits.upsert(directDebit, { transaction });
            } else if (type === 'creditcard') {
                let data = _.get(extra, 'creditCard', {}),
                    creditcard = { paymentId,  ...data};
                await postgres.PaymentCreditcards.upsert(creditcard, { transaction });
            }
        }

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving SalePayments: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.SalePayments.Post';

export { queue, register };
