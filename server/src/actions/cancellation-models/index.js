import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { BaseError } from 'sequelize';

export const INCLUDE_ACL = {
  code: 'A14',
  permissions: [ACLS.W],
  label: 'Tipos de Cancelamento',
  icon: 'MdBlock',
  group: 'Configurações',
  groupIcon: 'FaCog',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Cancellation Models params=%j', params);
    let model = {};
    if (params.id) {
      model = await postgres.CancellationModel.load(params);
    }
    let tags = await postgres.Tag.listAll(user);
    response.json({ model, tags: _.map(tags, 'tag') });
  }
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Cancellation Models offset=%s, term=%s', params.offset || 0, params.term || '' );
    let data = await postgres.CancellationModel.list(params, user);
    response.json(data);
  }
};

export const create = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models: { postgres }, logger, response }) => {
    logger.debug('Cancellation Models creating %j', params);
    await postgres.CancellationModel.create(params);
    response.json({ error: false });
  }
};

export const update = {
  method: 'put',
  acls: [ACLS.W],
  run: async ({ params, models: { postgres}, logger, response }) => {
    logger.debug('Cancellation Models updating %j', params);
    await postgres.CancellationModel.update(params, { where: { id: params.id } });
    response.json({ error: false });
  }
};
