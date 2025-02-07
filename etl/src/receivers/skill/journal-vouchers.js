import _ from 'lodash';
import axios from 'axios'
import { leftString, delay } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
	logger(`Skill - JournalVoucher: ${content.id} - ${content.refDate}`)
	const transaction = await postgres.JournalVouchers.sequelize.transaction();

	try {
		let lines = _.get(content, 'lines', []), status = _.get(content, 'status', ''),
			modelH = _.pick(content, ['id', 'status', 'group', 'refDate', 'taxDate', 'dueDate',
										'locTotal', 'tag', 'memo', 'ref3', 'projectId', 'pointOfSale',
										'championshipId', 'matchId', 'transId', 'logMessage']),
      url = _.get(content, 'url', ''),
			where = { id: _.get(content, 'id', '') },
			found = await postgres.JournalVouchers.findOne({ where, transaction });

		if (found) {
			status = _.get(found, 'status', '');
		}

		if (status === 'pending') {
			modelH.refDate = leftString(modelH.refDate, 10);
      modelH.taxDate = leftString(modelH.taxDate, 10);
      modelH.dueDate = leftString(modelH.dueDate, 10);
      modelH.tag = leftString(modelH.tag, 20);
      modelH.memo = leftString(modelH.memo, 100);
      modelH.ref3 = leftString(modelH.ref3, 30);
      modelH.projectId = leftString(modelH.projectId, 20);
      modelH.pointOfSale = leftString(modelH.pointOfSale, 20);
      modelH.championshipId = leftString(modelH.championshipId, 50);
      modelH.matchId = leftString(modelH.matchId, 50);
			modelH.logMessage = leftString(modelH.logMessage, 500);
      if (_.isNumber(modelH.locTotal) == false) {
          modelH.locTotal = 0;
      }
      if ((modelH.refDate >= '2021-06-22') && (modelH.refDate <= '2021-06-30')) {
        modelH.refDate = '2021-07-01';
      }

			await postgres.JournalVouchers.upsert(modelH, { transaction });

			for (var i = 0; i < lines.length; i++) {
				let item = lines[i],
						modelL = _.pick(item, ['jeId', 'lineId', 'visOrder', 'account', 'shortName', 'debit', 'credit',
																	 'balance', 'costingCenter', 'project', 'memo']);
				if (_.isNumber(modelL.debit) == false) {
						modelL.debit = 0;
				}
				if (_.isNumber(modelL.credit) == false) {
						modelL.credit = 0;
				}
				if (_.isNumber(modelL.balance) == false) {
						modelL.balance = 0;
				}
				modelL.memo = leftString(modelL.memo, 100);
				await postgres.JournalVoucherItems.upsert(modelL, { transaction });
			}
		}
		await transaction.commit();

    if (_.isEmpty(url) == false) {
      await delay(1500);
      await axios.post(url, {});
    }

		done()
	} catch(err) {
		logger(`Error saving JournalVoucher: ${err}`);
		await transaction.rollback();
		throw err;
	}
}

const register = (params) => {
	saveData(params)
};

const queue = 'incanto.Skill.JournalVouchers.Post';

export { queue, register };
