import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - AcquirerRejection: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.AcquirerRejections.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'acquirer', 'batchGroup', 'keyNsu', 'keyTid', 'tag', 'pointOfSale',
                                     'batchNo', 'saleType', 'captureDate', 'captureTime', 'grossAmount', 'rate',
                                     'commission', 'netAmount', 'nsu', 'authorization', 'tid', 'reference',
                                     'cardNumber', 'cardBrandCode', 'cardBrandName', 'rejectionCode', 'rejectionName',
                                     'captureType', 'terminalNo', 'sourceDb', 'sourceId', 'fileName', 'fileLine', 'saleId']);

        if (_.isNumber(model.grossAmount) == false) {
            model.grossAmount = 0;
        }
        if (_.isNumber(model.rate) == false) {
            model.rate = 0;
        }
        if (_.isNumber(model.commission) == false) {
            model.commission = 0;
        }
        if (_.isNumber(model.netAmount) == false) {
            model.netAmount = 0;
        }
        if (_.isNumber(model.fileLine) == false) {
            model.fileLine = 0;
        }
        model.fileName = leftString(_.get(model, 'fileName', ''), 100);
        model.rejectionName = leftString(_.get(model, 'rejectionName', ''), 100);
        let payment = await postgres.PaymentCreditcards.listSaleId(model.keyNsu);
        if (_.isEmpty(payment) == false) {
          model.saleId = _.get(_.first(payment), 'paymentData.saleId', '');
        }

        await postgres.AcquirerRejections.upsert(model, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving AcquirerRejection: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.AcquirerRejection.Post';

export { queue, register };

