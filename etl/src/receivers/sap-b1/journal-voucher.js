import _ from 'lodash'
import axios from 'axios'
import { leftString, delay } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
	logger(`SapB1 - JournalVoucher: ${content.WebId} - ${content.TransId}`)
	const transaction = await postgres.JournalVouchers.sequelize.transaction();

	try {
		const id = _.get(content, 'WebId', ''),
			status = (_.toLower(_.get(content, 'Status', '')) == 'success' ? 'closed' : 'error'),
			transId = _.get(content, 'TransId', ''),
      url = _.get(content, 'Url', '');

    let logMessage = leftString(_.get(content, 'Message', ''), 500),
      values = { status, transId, logMessage };

		await postgres.JournalVouchers.update(values, { where: { id }, transaction });
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

const queue = 'incanto.SapB1.JournalVoucher.Post';

export { queue, register };
