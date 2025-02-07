import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - AcquirerDispute: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.AcquirerDisputes.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'acquirer', 'batchGroup', 'keyNsu', 'keyTid', 'tag',
                                     'pointOfSale', 'batchNo', 'saleDate', 'endDate', 'processNo',
                                     'reference', 'nsu', 'authorization', 'tid', 'amount', 'cardNumber',
                                     'cardBrandCode', 'cardBrandName', 'notes', 'sourceDb', 'sourceId',
                                     'fileName', 'fileLine', 'saleId']);

        if (_.isNumber(model.amount) == false) {
            model.amount = 0;
        }
        if (_.isNumber(model.fileLine) == false) {
            model.fileLine = 0;
        }
        model.fileName = leftString(_.get(model, 'fileName', ''), 100);
        model.notes = leftString(_.get(model, 'notes', ''), 500);
        let payment = await postgres.PaymentCreditcards.listSaleId(model.keyNsu);
        if (_.isEmpty(payment) == false) {
          model.saleId = _.get(_.first(payment), 'paymentData.saleId', '');
        }

        await postgres.AcquirerDisputes.upsert(model, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving AcquirerDispute: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.AcquirerDispute.Post';

export { queue, register };

