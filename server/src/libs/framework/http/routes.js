import _ from 'lodash';
import stack from 'callsite';
import { dynamicLoad } from 'libs/framework/http/helper';
import { getParams, getCurrentUser } from 'libs/framework/http/utils';
import Response from 'libs/framework/http/response';
import { logged, authorizate } from 'middlewares';

global.system = { menu: [], acls: [] }

export const register = async function(logger, appName, options, app, actions, models) {
  logger.debug(`${appName} registering routes...`)

  if (!_.isEmpty(actions)) {
    const acts = await dynamicLoad(actions);
    let mdls = {};
    if (models) {
      mdls = await dynamicLoad(models)
    }
    build(logger, app, mdls, acts, '')
  }
}

const includeAcl = ({ module, permissions, label, group, groupIcon, icon, code, accounts = [] }) => {
  let resource = module.replace(/\//g, ''),
    found = _.find(global.system.acls, { code })

  if (found) {
    throw new Error(`Permissões com mesmos código nas Actions (${resource} - ${code}) == (${found.resource} - ${found.code})`)
  }
  global.system.acls.push({ resource, label, group, groupIcon, permissions, code, accounts })
  if (icon) {
    global.system.menu.push({ path: module, label, group, groupIcon, icon, code, accounts })
  }
}

const build = async (logger, app, models, actions, module = '') => {
  let code = ''

  Object.keys(actions).forEach((key) => {
    if (key === 'INCLUDE_ACL') {
      code = actions[key].code
      return includeAcl({ module, ...actions[key] })
    }
    const action = _.get(actions, key),
      method = _.toLower(_.get(action, 'method')),
      path = _.get(action, 'path'),
      route = `${module}/${path || _.kebabCase(key)}`

    if (_.isEmpty(method)) {
      build(logger, app, models, action, route)
    } else {
      const prefixed = `${route}`
      createRoute(logger, code, `${module}`, prefixed, method, action, app, models)
    }
  })
}

const prepareMiddlewares = function(logger, module, models, action) {
  const { middlewares = [], isPublic = false, acls = [] } = action,
    mids = middlewares.map(middleware => middleware({logger, module, models}));

  if (!isPublic) {
    mids.unshift(authorizate({logger, module, acls}))
    mids.unshift(logged({logger, module, models}))
  }
  return mids
}

const createRoute = function(logger, code, module, route, method, action, app, models) {
  const { run } = action,
    mids = prepareMiddlewares(logger, module, models, action)

  validate(action, logger);

  app[method](`${route}`, mids, async (request, response) => {
    const opts = {
      logger,
      models,
      module: route,
      request,
      params: getParams(request),
      user: getCurrentUser(request),
      response: new Response(response)
    };

    try {
      await run.call(null, opts);
    } catch(error) {
      const errors = transformError(error);
      logger.error('Module: %s, %s', route, error);
      console.log(error)
      response.status(500).send(errors);
    }
  });

  logger.debug(`(${code || '---'}) [${method}] ${route}`);
}

const transformError = (err) => {
  let result = {};

  if (err.errors && err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(error => {
      const { message } = error;
      return message;
    });
    result = {message: messages.join('\n')};
  } else if (err.errors) {
    for(var field in err.errors) {
      if (err.errors[field].name === 'ValidatorError')
      result[field] = err.errors[field].message
    }
  } else if (err.name && err.name === 'MongoError' && err.code && err.code === 11000) {
    let msg = _.get(err, 'errmsg', ''),
      indexName = msg.match('index: (.*) dup key:')[1]

    result = `error.duplicateKey.${indexName}`
  } else if (err.name && err.name === 'FieldValidationError') {
    result[err.field] = err.message
  } else {
    result = {'message': _.get(err,  'message') || err };
  }
  return result
}

const validate = function({method, module, run}, logger) {
  try {
    if (_.isEmpty(method) || ['get', 'post', 'put', 'delete', 'patch'].indexOf(method.toLocaleLowerCase()) === -1) throw new Error(`Module ${module}, action without method`)
    if (!run || !_.isFunction(run)) throw new Error(`Module ${module}, action without run method`)
  } catch (error) {
    logger.error(error)
  }
}
