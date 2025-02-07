import _ from 'lodash';
import { leftString } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
		const contentT = _.get(content, 'transaction', {}),
					contentI = _.get(content, 'installment', {});

		logger(`Skill - AcquirerTransaction: ${contentT.id} - ${contentT.sourceId}`)
		const transaction = await postgres.AcquirerTransactions.sequelize.transaction();

		try {
				let modelT = _.pick(contentT, ['id', 'acquirer', 'batchGroup', 'keyNsu', 'keyTid', 'tag',
																				'pointOfSale', 'batchNo', 'saleType', 'captureDate',
																				'captureTime', 'grossAmount', 'rate', 'commission', 'netAmount',
																				'nsu', 'authorization', 'tid', 'reference', 'cardNumber',
																				'cardBrandCode', 'cardBrandName', 'captureType', 'terminalNo',
																				'sourceDb', 'sourceId', 'fileName', 'fileLine']),
						modelI = _.pick(contentI, ['id', 'transactionId', 'installment', 'transType', 'dueDate',
                                        'grossAmount', 'rate', 'commission', 'netAmount', 'acctContent']);

        modelT['saleId'] = ''
				if (_.isNumber(modelT.grossAmount) == false) {
						modelT.grossAmount = 0;
				}
				if (_.isNumber(modelT.rate) == false) {
						modelT.rate = 0;
				}
				if (_.isNumber(modelT.commission) == false) {
						modelT.commission = 0;
				}
				if (_.isNumber(modelT.netAmount) == false) {
						modelT.netAmount = 0;
				}
        if (_.isNumber(modelT.fileLine) == false) {
            modelT.fileLine = 0;
        }
				if (_.isNumber(modelI.grossAmount) == false) {
						modelI.grossAmount = 0;
				}
				if (_.isNumber(modelI.rate) == false) {
						modelI.rate = 0;
				}
				if (_.isNumber(modelI.commission) == false) {
						modelI.commission = 0;
				}
				if (_.isNumber(modelI.netAmount) == false) {
						modelI.netAmount = 0;
				}
        modelT.fileName = leftString(_.get(modelT, 'fileName', ''), 100);

				await postgres.AcquirerTransactions.upsert(modelT, { transaction });
				await postgres.AcquirerInstallments.upsert(modelI, { transaction });

				await transaction.commit();

				done()
		} catch(err) {
				logger(`Error saving AcquirerTransaction: ${err}`);
				await transaction.rollback();
				throw err;
		}
}

const register = (params) => {
		saveData(params)
};

const queue = 'incanto.Skill.AcquirerTransaction.Post';

export { queue, register };
