import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A05',
  permissions: [],
  label: 'Grupos de Parceiros de Negócio',
  icon: 'MdGroupWork',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('BPGroups offset=%s, term=%s', params.offset, params.term || '');
    const data = await postgres.BpGroups.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load BPGroups params=%j', params);
    const data = await postgres.BpGroups.load(params);
    response.json(data);
  }
};
