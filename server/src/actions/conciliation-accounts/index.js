import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { md5 } from 'commons/tools';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const INCLUDE_ACL = {
  code: 'A22',
  permissions: [ACLS.W],
  label: 'Conciliação Contábil no SAP B1',
  icon: 'MdCompareArrows',
  group: 'Configurações',
  groupIcon: 'FaCog',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Conciliation Accounts params=%j', params);
    const data = await postgres.ConciliationAccounts.load(params);
    response.json(data);
  },
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Conciliation Accounts offset=%s, term=%s', params.offset || 0, params.term || '' );
    const data = await postgres.ConciliationAccounts.list(params);
    response.json(data);
  },
};

export const listChartOfAccounts = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Conciliation Accounts - finding chart of accounts => term=%s', params.term || '' );
    const data = await postgres.ChartOfAccounts.finding({ ...params, filter: { titleAccount: false } });
    response.json(data);
  },
};

export const listBusinessPartners = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Conciliation Accounts - finding business partner => params=%j', params);
    const data = await postgres.BusinessPartners.finding(params);
    response.json(data);
  },
};

export const create = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Conciliation Accounts creating %j', params);

    const acctCode = _.get(params, 'chartOfAccount.acctCode', ''),
      cardCode = _.get(params, 'businessPartner.cardCode', ''),
      id = md5(`${acctCode}-${cardCode}`),
      found = await models.postgres.ConciliationAccounts.findOne({where: {id}});

    if (found) {
      throw new ApiError('Já existe uma configuração contábil com os dados informados!');
    }

    const obj = {
      id,
      acctCode: _.get(params, 'chartOfAccount.acctCode'),
      cardCode: (_.get(params, 'chartOfAccount.lockManual') ? _.get(params, 'businessPartner.cardCode') : null),
      type: _.get(params, 'type'),
    };

    const inserted = await models.postgres.ConciliationAccounts.create(obj);

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        sourceDb: 'conciliationAccounts',
        sourceId: _.get(inserted, 'id', ''),
        action: 'insert',
        afterData: obj
      };
    await models.postgres.LogEntities.create(log);

    logger.debug('AccountConfig created %j', { ...obj, id: inserted.get('id') });
    response.json({});
  },
};

export const update = {
  method: 'put',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Conciliation Accounts updating %j', params);

    const values = {
        acctCode: _.get(params, 'chartOfAccount.acctCode'),
        cardCode: (_.get(params, 'chartOfAccount.lockManual') ? _.get(params, 'businessPartner.cardCode') : null),
        type: _.get(params, 'type'),
        id: _.get(params, 'id'),
      },
      found = await models.postgres.ConciliationAccounts.findOne({where: { id: params.id }});

    await models.postgres.ConciliationAccounts.update(values, { where: { id: params.id } });

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        action: 'update',
        sourceDb: 'conciliationAccounts',
        sourceId: params.id,
        beforeData: found,
        afterData: values
      };
    await models.postgres.LogEntities.create(log);

    logger.debug('Conciliation Accounts updating %j', values);
    response.json({});
  },
};

export const remove = {
  method: 'delete',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Conciliation Accounts removing %j', params);
    const id = _.get(params, 'id'),
      found = await models.postgres.ConciliationAccounts.findOne({where: {id}});
    if (!found) {
      throw new ApiError('Não existe uma configuração contábil para remoção.');
    }
    await models.postgres.ConciliationAccounts.destroy({where: {id}});

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        action: 'delete',
        sourceDb: 'conciliationAccounts',
        sourceId: id,
        afterData: found
      };
    await models.postgres.LogEntities.create(log);

    response.json({});
  },
};
