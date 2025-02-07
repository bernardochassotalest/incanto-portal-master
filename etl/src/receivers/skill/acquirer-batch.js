import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - AcquirerBatch: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.AcquirerBatches.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'acquirer', 'batchGroup', 'batchSource', 'group', 'type',
                                     'plan', 'tag', 'pointOfSale', 'batchNo', 'operationNo', 'refDate',
                                     'taxDate', 'dueDate', 'payDate', 'cardBrandCode', 'cardBrandName',
                                     'installment', 'qtyTransactions', 'qtyRejections',
                                     'bankCode', 'bankBranch', 'bankAccount',
                                     'grossAmount', 'rate', 'commission', 'netAmount', 'adjustment',
                                     'fee', 'settlement', 'rejectAmount', 'notes', 'sourceDb', 'sourceId',
                                     'fileName', 'fileLine']);

        if (_.isEmpty(model.bankCode) == false) {
            model.bankCode = _.join(_.slice(model.bankCode, -3), '');
        }
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
        if (_.isNumber(model.adjustment) == false) {
            model.adjustment = 0;
        }
        if (_.isNumber(model.fee) == false) {
            model.fee = 0;
        }
        if (_.isNumber(model.settlement) == false) {
            model.settlement = 0;
        }
        if (_.isNumber(model.rejectAmount) == false) {
            model.rejectAmount = 0;
        }
        if (_.isNumber(model.qtyTransactions) == false) {
            model.qtyTransactions = 0;
        }
        if (_.isNumber(model.qtyRejections) == false) {
            model.qtyRejections = 0;
        }
        if (_.isNumber(model.fileLine) == false) {
            model.fileLine = 0;
        }
        model.fileName = leftString(_.get(model, 'fileName', ''), 100);

        await postgres.AcquirerBatches.upsert(model, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving AcquirerBatch: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.AcquirerBatch.Post';

export { queue, register };
