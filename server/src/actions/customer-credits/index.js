import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { listDetails } from 'actions/sales';

export const INCLUDE_ACL = {
  code: 'A20',
  permissions: [ACLS.W],
  label: 'Créditos de Clientes',
  icon: 'MdAccountBalanceWallet',
  group: 'Relatórios',
  groupIcon: 'FaRegFileAlt',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const list = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    const customerId = _.get(params, 'customerId', ''),
      balanceType = _.get(params, 'balanceType', ''),
      offset = params.offset || 0;

    logger.debug('Customer Credits customerId=%s balanceType=%s offset=%s', customerId, balanceType, offset);
    const data = await postgres.CustomerCredits.listFiltered({ customerId, balanceType, offset }, user);
    response.json(data);
  }
};

export const listDetails = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    const customerId = _.get(params, 'customerId', '');
    if (_.isEmpty(customerId) == true) {
      throw new ApiError('Id do Cliente deve ser informado.');
    }
    logger.debug('Sales Detail customerId=%s', customerId);
    const data = await postgres.CustomerCredits.listDetails(customerId);
    response.json(data);
  }
};

export const listCustomers = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Customers - finding customers => params=%j', params);
    const data = await postgres.Customer.finding(params);
    response.json(data);
  },
};

export const listBillsDetails = listDetails;
