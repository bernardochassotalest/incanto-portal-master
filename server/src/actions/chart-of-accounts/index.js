import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A07',
  permissions: [],
  label: 'Plano de Contas',
  icon: 'FaClipboardList',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Chart of accounts offset=%s, term=%s', params.offset || 0, params.term || '');
    const data = await postgres.ChartOfAccounts.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load Chart of Account params=%j', params);
    const data = await postgres.ChartOfAccounts.load(params);
    response.json(data);
  }
};
