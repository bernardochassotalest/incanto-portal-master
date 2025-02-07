import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A09',
  permissions: [],
  label: 'Projetos',
  icon: 'FaCubes',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Projects offset=%s, term=%s', params.offset || 0, params.term || '');
    const data = await postgres.Projects.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load Project params=%j', params);
    const data = await postgres.Projects.load(params);
    response.json(data);
  }
};
