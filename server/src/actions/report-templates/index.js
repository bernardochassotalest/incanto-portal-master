import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { BaseError } from 'sequelize';

export const INCLUDE_ACL = {
  code: 'A12',
  permissions: [ACLS.W],
  label: 'Modelos de Relatórios',
  icon: 'FaTable',
  group: 'Configurações',
  groupIcon: 'FaCog',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Report Template params=%j', params);
    const data = await postgres.ReportTemplate.load(params, user);
    data.tag = { tag: data.tag };
    response.json(data);
  }
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Report Template offset=%s, term=%s', params.offset || 0, params.term || '' );
    const data = await postgres.ReportTemplate.list(params, user);
    response.json(data);
  }
};

const createReportTree = async (params, tmplDb, postgres, transaction) => {
  let tmplItems = _.get(params, 'items') || [],
    nodesMap = {};

  for (let i = 0; i < tmplItems.length; i++) {
    let tmplAccounts = _.get(tmplItems[i], 'accounts') || [],
      tempId = _.get(tmplItems[i], 'id'),
      tmplItemValues = _.pick(tmplItems[i], 'name', 'father', 'level', 'order');
    tmplItemValues.templateId = _.get(tmplDb, 'id');
    tmplItemValues.father = nodesMap[tmplItemValues.father] || null;

    let tmplItemDb = await postgres.ReportTemplateItem.create(tmplItemValues, { transaction });
    nodesMap[tempId] = _.get(tmplItemDb, 'id');

    for (let j = 0; j < tmplAccounts.length; j++) {
      let tmplAcctValues = _.pick(tmplAccounts[j], 'order');
      tmplAcctValues.account = _.get(tmplAccounts[j], 'accountData.acctCode');
      tmplAcctValues.templateId = _.get(tmplDb, 'id');
      tmplAcctValues.templateItemId = _.get(tmplItemDb, 'id');

      await postgres.ReportTemplateAccount.create(tmplAcctValues, { transaction });
    }
  }
}

export const create = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models: { postgres }, logger, response }) => {
    logger.debug('Report Template creating %j', params);
    let transaction = await postgres.ReportTemplate.sequelize.transaction();

    try {
      let tmplValues = _.pick(params, 'name', 'type', 'tag');
      tmplValues['tag'] = _.get(tmplValues, 'tag.tag') || 'sep';
      let tmplDb = await postgres.ReportTemplate.create(tmplValues, { transaction });

      await createReportTree(params, tmplDb, postgres, transaction);

      transaction.commit();
    } catch(err) {
      transaction.rollback();
      throw (err instanceof BaseError) ? new ApiError(`DB Failure ${err}`) : err;
    }
    response.json({});
  }
};

export const update = {
  method: 'put',
  acls: [ACLS.W],
  run: async ({ params, models: { postgres}, logger, response }) => {
    logger.debug('Report Template updating %j', params);
    let transaction = await postgres.ReportTemplate.sequelize.transaction();

    try {
      let tmplValues = _.pick(params, 'id', 'name', 'type', 'tag');
      tmplValues['tag'] = _.get(tmplValues, 'tag.tag') || 'sep';
      await postgres.ReportTemplate.update(tmplValues, { where: { id: params.id }, transaction });
      await postgres.ReportTemplateAccount.destroy({ where: { templateId: params.id }, transaction });
      await postgres.ReportTemplateItem.destroy({ where: { templateId: params.id }, transaction });

      await createReportTree(params, tmplValues, postgres, transaction);
      transaction.commit();
    } catch(err) {
      transaction.rollback();
      throw (err instanceof BaseError) ? new ApiError(`DB Failure ${err}`) : err;
    }
    response.json({});
  }
};

export const listTags = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Report Template - finding tags => term=%s', params.term || '');
    const data = await postgres.Tag.finding(params, user);
    response.json(data);
  },
};

export const listAccounts = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Report Template - finding accounts => term=%s', params.term || '');
    const data = await postgres.ChartOfAccounts.finding({ ...params, filter: { titleAccount: false } });
    response.json(data);
  },
};
