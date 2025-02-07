import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A03',
  permissions: [],
  label: 'Adquirentes',
  icon: 'MdImportantDevices',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Acquirers offset=%s, term=%s', postgres, params.offset, params.term || '');
    const data = await postgres.Acquirers.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load Acquirers params=%j', params);
    const data = await postgres.Acquirers.load(params);
    response.json(data);
  }
};
