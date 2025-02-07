import _ from 'lodash';
import got from 'got';
import { md5 } from 'commons/tools';
import { logged, upload } from 'middlewares';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';

export const INCLUDE_ACL = {
  code: 'A01',
  permissions: [ ACLS.W ],
  label: 'Usuários',
  icon: 'FaUser',
  group: 'Cadastros',
  groupIcon: 'FaRegEdit',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const list = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Users offset=%s, term=%s', params.offset, params.term || '');
    const data = await postgres.User.byAccount(params, user);
    response.json(data);
  }
};

export const load = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('Load user params=%j', params);
    const include = [
        {
          as: 'profile',
          model: postgres.Profile,
          attributes: ['id', 'name']
        }
      ],
      attributes = [ 'id', 'email', 'name', 'active' ],
      where = {
        accountId: user.accountId,
        id: params.id
      }

    const data = await postgres.User.findOne({ where, include, attributes }) || {};
    response.json(data);
  }
};

export const create = {
  method: 'post',
  acls: [ ACLS.W ],
  run: async ({params, models: { postgres }, user, logger, response}) => {
    logger.debug('User creating %j', params);
    const found = await postgres.User.findSimilar(params, user);
    if (found) {
      throw new ApiError('Já existe um usuário com esse email!');
    }
    const values = {
      'accountId': user.accountId,
      ...params
    };
    values.profileId = _.get(params, 'profile.id');
    const inserted = await postgres.User.create(values);
    logger.debug('User created %j', {...values, 'id': inserted.get('id')});
    response.json({});
  }
}

export const update = {
  method: 'put',
  acls: [ ACLS.W ],
  run: async ({params, models: { postgres }, user, logger, response}) => {
    const found = await postgres.User.findSimilar(params, user);
    if (found) {
      throw new ApiError('Já existe um usuário com esse email!');
    }
    const values = { 'accountId': user.accountId, ...params };
    values.profileId = _.get(params, 'profile.id');
    await postgres.User.update(values, { where: { id: params.id } });
    logger.debug('User updating %j', values);
    response.json({});
  }
};

export const resetPassword = {
  method: 'put',
  acls: [ ACLS.W ],
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('User change password params=%j', params);
    const data = await postgres.User.resetPassword(params);
    response.json(data);
  }
};

export const updatePassword = {
  method: 'put',
  isPublic: true,
  middlewares: [ logged ],
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('User change password params=%j', params);
    const data = await postgres.User.updatePassword({...params, user});
    response.json(data);
  }
};

export const updateBasic = {
  method: 'put',
  isPublic: true,
  middlewares: [ logged ],
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('User change params=%j', params);
    const data = await postgres.User.updateBasic({...params, user});
    response.json(data);
  }
};

export const updateAvatar = {
  method: 'post',
  isPublic: true,
  middlewares: [ logged, upload(null, { 'rename': true, 'width': 200, 'height': 200 })],
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('%j', _.keys(params))
    const filepath = _.get(params, 'file[0].path') || '';
    logger.debug('User avatar filepath=%s', filepath);
    const data = await postgres.User.updateAvatar({filepath, user});
    response.json({'avatar': data});
  }
};

export const loadAvatar = {
  method: 'get',
  isPublic: true,
  middlewares: [ logged ],
  run: async ({params, logger, response}) => {
    logger.debug('User avatar filename=%s', params.filename);
    const filepath = `${process.env.DIR_ATTACHMENT}/users/${params.filename}`;
    response.download(filepath);
  }
};

export const avatar = {
  method: 'get',
  isPublic: true,
  run: async ({params, logger, response}) => {
    logger.debug('Avatar params=%j', params);
    let emailMd5 = md5(params.email);
    try {
      let { rawBody } = await got(`https://gravatar.com/avatar/${emailMd5}?d=404`);
      response.json({ base64: `data:image/png;base64,${Buffer.from(rawBody).toString('base64')}` });
    } catch (error) {
      response.json({ base64: null });
    }
  }
};

export const listProfiles = {
  method: 'get',
  run: async ({params, models: { postgres }, logger, user, response}) => {
    logger.debug('List Profiles params=%j', params);
    const data = await postgres.Profile.byAccountSearch(params, user);
    response.json(data);
  }
};
