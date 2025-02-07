import _ from 'lodash';
import { ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A08',
  permissions: [],
  label: 'Centros de Custo',
  icon: 'FaMoneyCheckAlt',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Costing centers offset=%s, term=%s', params.offset || 0, params.term || '');
    const data = await postgres.CostingCenters.list(params);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load Costing center params=%j', params);
    const data = await postgres.CostingCenters.load(params);
    response.json(data);
  }
};
