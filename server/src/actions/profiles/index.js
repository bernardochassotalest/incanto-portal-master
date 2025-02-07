import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import {
  prepareAllRules,
  getArrayFromText,
  getTextfromArray,
} from 'libs/framework/http/helper';

export const INCLUDE_ACL = {
  code: 'A02',
  permissions: [ACLS.W],
  label: 'Perfis',
  icon: 'FaUsers',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.log('Profile offset=%s, term=%s', params.offset, params.term || '');
    const data = await postgres.Profile.byAccount(params, user);
    response.json(data);
  },
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load profile params=%j', params);
    const attributes = ['id', 'name', 'active', 'permissions', 'tags'],
      where = {
        accountId: user.accountId,
        id: params.id,
      };

    let profile = { active: true, permissions: [] },
      tags = _.map(await postgres.Tag.findAll({ attributes: ['tag'] }), 'tag');

    if (params.id !== 'new') {
      profile = (await postgres.Profile.findOne({ where, attributes, raw: true })) || {};
      profile.permissions = getArrayFromText(profile.permissions);
    }
    if (!user.profileId === 1) {
      profile.tags = tags;
    }
    response.json({ profile, permissions: prepareAllRules(user.accountType), tags });
  },
};

export const create = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Profile creating %j', params);
    const found = await models.postgres.Profile.findSimilar(params, user);
    if (found) {
      throw new ApiError('Já existe um perfil com esse nome!');
    }
    const values = {
      accountId: user.accountId,
      ...params,
    };
    values.profileId = _.get(params, 'profile.id');
    values.permissions = getTextfromArray(values.permissions);
    values.tags = values.tags || [];
    const inserted = await models.postgres.Profile.create(values);
    logger.debug('Profile created %j', { ...values, id: inserted.get('id') });
    response.json({});
  },
};

export const update = {
  method: 'put',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    const found = await models.postgres.Profile.findSimilar(params, user);
    if (found) {
      throw new ApiError('Já existe um perfil com esse nome!');
    }
    const values = { accountId: user.accountId, ...params };
    values.profileId = _.get(params, 'profile.id');
    values.permissions = getTextfromArray(values.permissions);
    values.tags = values.tags || [];
    await models.postgres.Profile.update(values, { where: { id: params.id } });
    logger.debug('Profile updating %j', values);
    response.json({});
  },
};
