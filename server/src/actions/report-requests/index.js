import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { mail } from 'commons/jobs';

export const INCLUDE_ACL = {
  code: 'A16',
  permissions: [ACLS.W],
  label: 'Exportação de Dados em Planilha do Excel',
  icon: 'FaFileExport',
  group: 'Relatórios',
  groupIcon: 'FaRegFileAlt',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Report Requests params=%j', params);
    const data = await postgres.ReportRequests.load(params);
    response.json(data);
  },
};

export const list = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug(
      'List Report Requests offset=%s, term=%s',
      params.offset,
      params.term || ''
    );
    const data = await postgres.ReportRequests.list(params, user);
    response.json(data);
  },
};

export const listReportTypes = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug(
      'Report Requests - finding types => term=%s',
      params.term || ''
    );
    const data = await postgres.ReportTypes.finding(params);
    response.json(data);
  },
};

export const exportXlsx = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Report Requests - exporting => id=%s', params.id || '');
    let found = await postgres.ReportRequests.findOne({where: {id: params.id}});
    if (!found) {
      throw new ApiError('Relatório não encontrado.');
    }
    response.download(found.fileName);
  },
}

export const create = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Report Requests creating %j', params);
    let model = {
        id: uuidv4(),
        status: 'pending',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm:ss'),
        userId: _.get(user, 'id', ''),
        typeId: _.get(params, 'typeId', ''),
        filters: _.omit(params, 'typeId')
      };
    let result = await postgres.ReportRequests.create(model);
    await mail.excelReports({id: model.id});

    const log = {
        id: uuidv4(),
        userId: _.get(user, 'id', ''),
        timeLog: format(new Date(), 'yyyy-MM-dd HH:mm:ss.T'),
        sourceDb: 'reportRequests',
        sourceId: _.get(result, 'id', ''),
        action: 'insert',
        afterData: model
      };
    await postgres.LogEntities.create(log);

    response.json({ error: false });
  }
};
