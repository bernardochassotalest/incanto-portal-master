import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A04',
  permissions: [],
  label: 'Bancos',
  icon: 'MdAccountBalance',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Banks offset=%s, term=%s', postgres, params.offset, params.term || '');
    const data = await postgres.Banks.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load Banks params=%j', params);
    const data = await postgres.Banks.load(params);
    response.json(data);
  }
};
