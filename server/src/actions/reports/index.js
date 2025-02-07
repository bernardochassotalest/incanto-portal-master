import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { Op, BaseError, Sequelize } from 'sequelize';
import { format } from 'date-fns';
import { formats } from 'commons/helper';
import XLSX from 'xlsx';
import { postgres } from 'models';

export const INCLUDE_ACL = {
  code: 'A13',
  permissions: [ACLS.W],
  label: 'Relatório Contábil',
  icon: 'MdAssignment',
  group: 'Relatórios',
  groupIcon: 'FaRegFileAlt',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

const DateFieldsMap = {
  'due': 'dueDate',
  'ref': 'refDate',
  'tax': 'taxDate'
};

const getAccountMovement = async (params)  => {
  let dateField = DateFieldsMap[params.dateField] || 'taxDate',
    columnDate = `\$journalEntries.${dateField}\$`;

  let where = {
      account: params.account,
      [columnDate]: { [Op.between]: [ String(params.startDate).substr(0, 10), String(params.endDate).substr(0, 10) ] }
    },
    include = [
      { as: 'journalEntries', model: postgres.JournalEntries, attributes: ['transId', 'tag', 'refDate', 'taxDate', 'dueDate', 'ref3', 'memo'],
        include: [{ as: 'user', model: postgres.SapB1Users, attributes: ['id', 'name'] }] }
    ];

  if (_.isEmpty(params.tags) == false) {
    where['$journalEntries.tag$'] = { [Op.in]: params.tags };
  }

  return await postgres.JournalEntryItems.findAll({ where, include, attributes: ['lineId', 'debit', 'credit', 'memo'] });
}

const setTags = (params, user) => {
  let tags = (_.get(params, 'tags') ? _.split(_.get(params, 'tags', ''), ',') : []);
  if (!_.isEmpty(tags) && !user.profileId !== 1) {
    tags = _.intersection(tags, user.tags);
  } else if (_.isEmpty(tags) && !user.profileId !== 1) {
    tags = user.tags;
  }
  params['tags'] = tags;
}

export const generate = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Report params=%j', params);

    if (!_.get(params, 'template.id') || !params.startDate || !params.endDate) {
      return response.json([]);
    }

    setTags(params, user);

    const template = await postgres.ReportTemplate.load({ id: _.get(params, 'template.id') }, user),
      accounts = _.map(await postgres.ReportTemplateAccount.aggregate('account', 'DISTINCT', { where: { templateId: _.get(params, 'template.id') }, plain: false }), 'DISTINCT'),
      items = template.items;

    let dateField = DateFieldsMap[params.dateField] || 'taxDate',
      where = { account: accounts || [ '-' ], };

    if (_.isEmpty(params.tags) == false) {
      where['$journalEntries.tag$'] = { [Op.in]: params.tags };
    }

    let entries = await postgres.JournalEntryItems.findAll({
        include: [
          {
            as: 'journalEntries',
            model: postgres.JournalEntries,
            where: { [dateField]: { [Op.between]: [ params.startDate, params.endDate ] } },
            attributes: []
          }
        ],
        where: where,
        attributes: ['account', [Sequelize.fn('sum', Sequelize.col('balance')), 'total']],
        group: ['account'],
        raw: true,
        nest: true
      }),
      valuesMap = [];
    _.each(entries, (r) => valuesMap[r.account] = r.total || 0);

    _.each(items, (item) => {
      _.each(item.accounts || [], (acct) => {
        acct.value = valuesMap[acct.account] || 0;
      });
    });

    response.json(items);
  }
};

export const listTemplates = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Reports - finding templates => term=%s', params.term || '');
    setTags(params, user);
    const data = await postgres.ReportTemplate.finding(params, user);
    response.json(data);
  },
};
export const listTags = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Reports - finding tags => term=%s', params.term || '');
    const data = await postgres.Tag.finding(params, user);
    response.json(data);
  }
};

export const accountMovement = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Reports - Details of account - %j', params);
    setTags(params, user);
    let data = await getAccountMovement(params);
    response.json(data);
  }
};

const detailsExportMap = {
  'journalEntries.transId': 'Nr LCM',
  'journalEntries.tag': 'Tag',
  'journalEntries.refDate': 'Dt Lançamento',
  'journalEntries.taxDate': 'Dt Venda',
  'journalEntries.dueDate': 'Dt Vencimento',
  'debit': 'Valor Débito',
  'credit': 'Valor Crédito',
  'memo': 'Detalhes',
  'journalEntries.user.name': 'Usuário'
};

export const exportDetailsXlsx = {
  method: 'get',
  run: async ({ params, models: { postgres }, user, logger, response }) => {
    logger.debug('Reports - xlsx of account - %j', params);

    let list = await getAccountMovement(params),
      data = [];

    _.each(list, (row) => {
      let item = {};
      for (let key in detailsExportMap) {
        let field = detailsExportMap[key];
        _.set(item, field, _.get(row, key));
      }
      data.push(item);
    });

    let header = _.values(detailsExportMap),
      ws = XLSX.utils.json_to_sheet(data, { header, dateNF: 'dd/MM/yyyy' }),
      wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `Lançamentos Conta ${params.account}`);

    let contents = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    response.downloadBuffer(contents, `detalhes.xlsx`);
  },
};
