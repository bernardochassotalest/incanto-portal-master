import _ from 'lodash';
import { BaseError } from 'sequelize';
import { getLastAccess } from 'libs/framework/http/utils';

const handleLogin = async (params, request, models, fromMobile = false) => {
  const payload = { ...params, fromMobile, lastAccess: getLastAccess(request) };
  return await models.postgres.User.login(payload, models.postgres);
};

export const login = {
  method: 'post',
  isPublic: true,
  run: async ({ params, models, logger, request, response }) => {
    const data = await handleLogin(params, request, models);
    response.json(data);
  },
};

export const forgetPassword = {
  method: 'post',
  isPublic: true,
  run: async ({ params, models, logger, request, response }) => {
    logger.log('Forget password user %j', params);
    let user = await models.postgres.User.findOne({
      where: { email: params.email },
    });

    if (!user) {
      throw new ApiError('Email não vinculado a nenhum usuário!');
    }
    let data = await models.postgres.User.resetPassword(user);
    response.json(data);
  },
};
