import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { md5 } from 'commons/tools';
import { formats, tryParseStringToDate } from 'commons/helper';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const DEFAULT_ACCOUNT = process.env.DEFAULT_ACCOUNT;

export const INCLUDE_ACL = {
  code: 'A10',
  permissions: [ACLS.W],
  label: 'Configuração Contábil',
  icon: 'MdSettingsInputComponent',
  group: 'Configurações',
  groupIcon: 'FaCog',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Account Config params=%j', params);
    const data = await postgres.AccountConfig.load(params);
    const count = await postgres.AccountConfig.countJE(params);
    const model = JSON.parse(JSON.stringify(data));
    if (model.debAccount === DEFAULT_ACCOUNT) {
      model.debAccount = null;
      model.debChartOfAccount = null;
    }
    if (model.crdAccount === DEFAULT_ACCOUNT) {
      model.crdAccount = null;
      model.credChartOfAccount = null;
    }
    model.editLocked = (count > 0 ? true : false);
    response.json(model);
  },
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config params=%s', JSON.stringify(params) );
    const data = await postgres.AccountConfig.list(params);
    response.json(data);
  },
};

export const listSources = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding data sources => term=%s', params.term || '');
    const data = await postgres.DataSource.finding(params);
    response.json(data);
  },
};

export const listModels = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding account models => term=%s', params.term || '');
    const data = await postgres.AccountingModel.finding(params);
    response.json(data);
  },
};

export const listSourceItems = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding source items => params=%j', params);
    const data = await postgres.SourceItem.finding(params);
    response.json(data);
  },
};

export const listChartOfAccounts = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding chart of accounts => term=%s', params.term || '' );
    const data = await postgres.ChartOfAccounts.finding({ ...params, filter: { titleAccount: false } });
    response.json(data);
  },
};

export const listBusinessPartners = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding business partner => params=%j', params);
    const data = await postgres.BusinessPartners.finding(params);
    response.json(data);
  },
};

export const listCostingCenters = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding costing centers => term=%s', params.term || '');
    const data = await postgres.CostingCenters.finding(params);
    response.json(data);
  },
};

export const listProjects = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Account Config - finding projects => term=%s', params.term || '');
    const data = await postgres.Projects.finding(params);
    response.json(data);
  },
};

export const create = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Account Config creating %j', params);

    const validFrom = _.get(params, 'validFrom'),
      values = {
        validFrom: formats.dateTimeZone(validFrom, 'yyyy-MM-dd'),
        model: _.get(params, 'accountingModel.id'),
        source: _.get(params, 'dataSource.id'),
        item: _.get(params, 'sourceItem.id'),
      },
      id = md5(JSON.stringify(values)),
      found = await models.postgres.AccountConfig.findOne({where: {id}});

    if (found) {
      throw new ApiError('Já existe uma configuração contábil com os dados informados!');
    }

    const obj = {
      ...values,
      id,
      debAccount: _.get(params, 'debChartOfAccount.acctCode'),
      debShortName: (_.get(params, 'debChartOfAccount.lockManual') ? _.get(params, 'debBusinessPartner.cardCode') : null),
      debCostingCenter: _.get(params, 'debitCostingCenter.ocrCode') || null,
      debProject: _.get(params, 'debitProject.prjCode') || null,
      crdAccount: _.get(params, 'credChartOfAccount.acctCode'),
      crdShortName: (_.get(params, 'credChartOfAccount.lockManual') ?_.get(params, 'credBusinessPartner.cardCode') : null),
      crdCostingCenter: _.get(params, 'creditCostingCenter.ocrCode') || null,
      crdProject: _.get(params, 'creditProject.prjCode') || null,
      isActive: !!_.get(params, 'isActive'),
    };

    const inserted = await models.postgres.AccountConfig.create(obj);

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        sourceDb: 'accountConfigs',
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
    logger.debug('Account Config updating %j', params);

    const values = {
        debAccount: _.get(params, 'debChartOfAccount.acctCode'),
        debShortName: (_.get(params, 'debChartOfAccount.lockManual') ? _.get(params, 'debBusinessPartner.cardCode') : null),
        debCostingCenter: _.get(params, 'debitCostingCenter.ocrCode') || null,
        debProject: _.get(params, 'debitProject.prjCode') || null,
        crdAccount: _.get(params, 'credChartOfAccount.acctCode'),
        crdShortName: (_.get(params, 'credChartOfAccount.lockManual') ? _.get(params, 'credBusinessPartner.cardCode') : null),
        crdCostingCenter: _.get(params, 'creditCostingCenter.ocrCode') || null,
        crdProject: _.get(params, 'creditProject.prjCode') || null,
        isActive: !!_.get(params, 'isActive'),
        id: _.get(params, 'id'),
      },
      found = await models.postgres.AccountConfig.findOne({where: { id: params.id }});

    await models.postgres.AccountConfig.update(values, { where: { id: params.id } });

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        action: 'update',
        sourceDb: 'accountConfigs',
        sourceId: params.id,
        beforeData: found,
        afterData: values
      };
    await models.postgres.LogEntities.create(log);

    logger.debug('Account Config updating %j', values);
    response.json({});
  },
};

export const remove = {
  method: 'delete',
  acls: [ACLS.W],
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Account Config removing %j', params);
    const id = _.get(params, 'id'),
      found = await models.postgres.AccountConfig.findOne({where: {id}});
    if (!found) {
      throw new ApiError('Não existe uma configuração contábil para remoção.');
    }
    const accountingItem = await models.postgres.AccountingItem.findOne({where: {accountItem: id}, attributes:['id']})
    if (accountingItem) {
      throw new ApiError('Configuração contábil não pode ser removida pois existe lançamento contábil relacionado.');
    }
    await models.postgres.AccountConfig.destroy({where: {id}});

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        action: 'delete',
        sourceDb: 'accountConfigs',
        sourceId: id,
        afterData: found
      };
    await models.postgres.LogEntities.create(log);

    response.json({});
  },
};
