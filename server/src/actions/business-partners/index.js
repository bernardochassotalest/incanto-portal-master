import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A06',
  permissions: [],
  label: 'Parceiros de Negócio',
  icon: 'FaUserTie',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'post',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Business partners offset=%s, term=%s', params.offset || 0, params.term || '');
    const data = await postgres.BusinessPartners.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load Business partner params=%j', params);
    const data = await postgres.BusinessPartners.load(params);
    response.json(data);
  }
};

export const listGroups = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('List BP groups params=%j', params);
    const data = await postgres.BpGroups.finding(params, user);
    response.json(data);
  }
};
