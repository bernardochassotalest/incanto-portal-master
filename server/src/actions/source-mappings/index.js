import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const INCLUDE_ACL = {
  code: 'A11',
  permissions: [ACLS.W],
  label: 'Mapeamento das Fontes de Dados',
  icon: 'MdLowPriority',
  group: 'Configurações',
  groupIcon: 'FaCog',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Source Mapping params=%j', params);
    const data = await postgres.SourceMapping.load(params);
    response.json(data);
  },
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug( 'List Source Mapping params=%s', JSON.stringify(params));
    const MAP = {
        'multiclubes': 'multiclubes',
        'avanti': 'vindi'
      };
    params['source'] = [];
    user.tags.forEach(x => {
      if (_.isEmpty(MAP[x]) == false) {
        params.source.push(MAP[x]);
      }
    });
    const data = await postgres.SourceMapping.list(params);
    response.json(data);
  },
};

export const listSourceItems = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug(
      'Source Mapping - finding groups sources => term=%s',
      params.term || ''
    );
    const data = await postgres.SourceItem.finding(params);
    response.json(data);
  },
};

export const update = {
  method: 'put',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Source Mapping updating %j', params);

    const values = {
        itemSource: _.get(params, 'source'),
        itemId: _.get(params, 'sourceItem.id'),
      },
      found = await models.postgres.SourceMapping.findOne({where: { id: params.id }});

    await models.postgres.SourceMapping.update(values, { where: { id: params.id } });

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        action: 'update',
        sourceDb: 'sourceMappings',
        sourceId: params.id,
        beforeData: found,
        afterData: values
      };
    await models.postgres.LogEntities.create(log);

    logger.debug('Source Mapping updating %j', values);
    response.json({});
  },
};
