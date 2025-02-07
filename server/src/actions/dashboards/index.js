import _ from 'lodash';
import { format } from 'date-fns';
import { leftString } from 'commons/helper';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import * as conciliationItems from 'actions/dashboards/conciliation-items';
import { listDetails } from 'actions/sales';
import { getArrayFromText } from 'libs/framework/http/helper';
import { generateSummaryReport } from 'libs/report';

export const INCLUDE_ACL = {
  code: 'A18',
  permissions: [ACLS.C, ACLS.S],
  label: 'Dashboard Contábil',
  icon: 'FaTachometerAlt',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

const collectedData = async (postgres, startDate, endDate, tags, canBankStatements) => {
  let result = [];

  result = _.concat(result, await postgres.Sale.listDashboard(startDate, endDate, tags));
  result = _.concat(result, await postgres.MulticlubesPayments.listDashboard(startDate, endDate, tags));
  result = _.concat(result, await postgres.VindiTransactions.listDashboard(startDate, endDate, tags));
  result = _.concat(result, await postgres.AcquirerBatches.listDashboard(startDate, endDate, tags));
  result = _.concat(result, await postgres.SlipTransactions.listDashboard(startDate, endDate, tags));
  result = _.concat(result, await postgres.SlipFees.listDashboard(startDate, endDate, tags));
  if (canBankStatements) {
    result = _.concat(result, await postgres.BankStatements.listDashboard(startDate, endDate));
  }
  return result;
};

const checkCollectedData = (data) => {
  return true; //TODO: Revisar bloqueio após todos os parsers
  let result = true,
    conciliation = _.map(data, 'conciliation'),
    grouped = [];

  for (let i = 0; i < conciliation.length; i++) {
    let item = conciliation[i],
      rule = _.get(item, 'rule', ''),
      filter = { rule },
      found = _.findLast(grouped, filter);

    if (_.isEmpty(rule) == false) {
      if (found) {
        found['debit'] += item.debit;
        found['credit'] += item.credit;
      } else {
        grouped.push(item);
      }
    }
  }

  for (let i = 0; i < grouped.length; i++) {
    let item = grouped[i];
    if ((item.debit <= 0) || (item.credit <= 0)) {
      result = false;
      break;
    }
  }

  return result;
}

const conciliationData = async (postgres, startDate, endDate, tags) => {
  let result = [];

  result = _.concat(result, await postgres.ConciliationItems.listDashboard(startDate, endDate));
  result = _.concat(result, await postgres.ConciliationMessages.listDashboard(startDate, endDate));
  result = _.concat(result, await postgres.JournalVoucher.listDashboardErrors(startDate, endDate, tags));
  result = _.concat(result, await postgres.JournalEntries.listDashboardCards(startDate, endDate, tags));

  return result;
};

export const load = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Dashboard Contábil - Load params=%j', params);
    let tags = (_.get(params, 'tags') ? _.split(_.get(params, 'tags', ''), ',') : []);

    const canBankStatements = (_.get(_.find(getArrayFromText(user.permissions), {'code':'A18'}), 'perms') || []).includes('S')

    if (!_.isEmpty(tags) && !user.profileId !== 1) {
      tags = _.intersection(tags, user.tags);
    } else if (_.isEmpty(tags) && !user.profileId !== 1) {
      tags = user.tags;
    }

    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      month = leftString(startDate, 7),
      collected = await collectedData(postgres, startDate, endDate, tags, canBankStatements),
      result = {
        period: { dateField, month, startDate, endDate, tags },
        calendar: await postgres.Conciliations.listDashboard(month),
        stepA: {
          description: 'Coleta de Dados',
          collected: collected,
        },
        stepB: {
          description: 'Conciliação',
          allDataCollected: checkCollectedData(collected),
          conciliation: await conciliationData(postgres, startDate, endDate, tags),
        },
        stepC: {
          description: 'Contabilização',
          invoiced: await postgres.JournalVoucher.listDashboardInvoiced(dateField, startDate, endDate, tags),
          notCaptured: await postgres.JournalVoucher.listDashboardNotCaptured(dateField, startDate, endDate, tags),
          settlement: await postgres.JournalVoucher.listDashboardSettlement(dateField, startDate, endDate, tags),
          creditcard: await postgres.JournalVoucher.listDashboardCreditcard(dateField, startDate, endDate, tags),
          slip: await postgres.JournalVoucher.listDashboardSlip(dateField, startDate, endDate, tags),
          directDebit: await postgres.JournalVoucher.listDashboardDirectDebit(dateField, startDate, endDate, tags),
          pecld: await postgres.JournalVoucher.listDashboardPECLD(dateField, startDate, endDate, tags),
          canceled: await postgres.JournalVoucher.listDashboardCanceled(dateField, startDate, endDate, tags),
          fee: await postgres.JournalVoucher.listDashboardFee(dateField, startDate, endDate, tags),
        }
      };
    response.json(result);
  }
};

export const listTags = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Dashboard Contábil - finding tags => term=%s', params.term || '');
    const data = await postgres.Tag.finding(params, user);
    response.json(data);
  }
};

export const listInvoiced = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list invoiced => dateField=%s startDate=%s endDate=%s', dateField, startDate, endDate);
    const data = await postgres.Sale.listInvoiced(dateField, startDate, endDate, offset);
    response.json(data);
  }
};

export const listNotCaptured = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list not captured => dateField=%s startDate=%s endDate=%s', dateField, startDate, endDate);
    const data = await postgres.Sale.listNotCaptured(dateField, startDate, endDate, offset);
    response.json(data);
  }
};

export const listCreditcard = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list creditcard => dateField=%s startDate=%s endDate=%s', dateField, startDate, endDate);
    const data = await postgres.Sale.listCreditcard(dateField, startDate, endDate, offset);
    response.json(data);
  }
};

export const listSlip = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list slip => dateField=%s startDate=%s endDate=%s', dateField, startDate, endDate);
    const data = await postgres.Sale.listSlip(dateField, startDate, endDate, offset);
    response.json(data);
  }
};

export const listDirectDebit = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list direct debit dateField=%s debit => startDate=%s endDate=%s', dateField, startDate, endDate);
    const data = await postgres.Sale.listDirectDebit(dateField, startDate, endDate, offset);
    response.json(data);
  }
};

export const listPECLD = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let dateField = _.get(params, 'dateField') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list pecld dateField=%s debit => startDate=%s endDate=%s', dateField, startDate, endDate);
    const data = await postgres.Sale.listPECLD(dateField, startDate, endDate, offset);
    response.json(data);
  }
};

export const listBills = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let group = _.get(params, 'group', ''),
      field = _.get(params, 'field') || 'taxDate',
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      tags = _.get(params, 'tags', []),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list bills => group=%s field=%s startDate=%s endDate=%s tags=%s', group, field, startDate, endDate, tags);
    const data = await postgres.JournalVoucher.listBills(group, field, startDate, endDate, tags, offset);
    response.json(data);
  }
};

export const listSales = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let source = _.get(params, 'source', ''),
      tag = _.get(params, 'tag', ''),
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list sales => source=%s tag=%s startDate=%s endDate=%s tags=%s', source, tag, startDate, endDate);
    const data = await postgres.Sale.listDashboardDetail(source, tag, startDate, endDate, offset);
    response.json(data);
  }
};

export const listVindi = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let paymentMethod = _.get(params, 'paymentMethod', ''),
      status = _.get(params, 'status', ''),
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      tags = _.get(params, 'tags', []),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list vindi => paymentMethod=%s status=%s startDate=%s endDate=%s tags=%s', paymentMethod, status, startDate, endDate, tags);
    const data = await postgres.VindiTransactions.listDashboardDetail(paymentMethod, status, startDate, endDate, tags, offset);
    response.json(data);
  }
};

export const listAcquirers = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let group = _.get(params, 'group', ''),
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      acquirer = _.get(params, 'acquirer', ''),
      tags = _.get(params, 'tags', []),
      data = [];

    logger.debug('Dashboard Contábil - list acquirers => group=%s startDate=%s endDate=%s tags=%s', group, startDate, endDate, tags);
    if (group == 'venda') {
      data = await postgres.AcquirerTransaction.listDashboardDetail(startDate, endDate, acquirer, tags);
    } else if (group == 'liquidacao') {
      data = await postgres.AcquirerBatches.listDashboardDetail(startDate, endDate, acquirer, tags);
    }
    response.json(data);
  }
};

export const listJeErrors = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let tag = _.get(params, 'tag', ''),
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list lcm errors => tag=%s startDate=%s endDate=%s tags=%s', tag, startDate, endDate);
    const data = await postgres.JournalVoucher.listDashboardErrorsDetail(tag, startDate, endDate, offset);
    response.json(data);
  }
};

export const jeResend = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let id = _.get(params, 'id', '');

    logger.debug('Dashboard Contábil - Resend JE => id=%s', id);
    const data = await postgres.JournalVoucher.update({status: 'pending', logMessage: ''}, { where: { id } });
    response.json(data);
  }
};

export const listMessages = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let messageType = _.get(params, 'messageType', ''),
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list messages => messageType=%s startDate=%s endDate=%s', messageType, startDate, endDate);
    const data = await postgres.ConciliationMessages.listDashboardDetail(messageType, startDate, endDate, offset);
    response.json(data);
  }
};

export const confirmMessages = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let id = _.get(params, 'id', '');

    logger.debug('Dashboard Contábil - Confirm Messages => id=%s', id);
    const data = await postgres.ConciliationMessages.update({isActive: false}, { where: { id } });
    response.json(data);
  }
};

export const listJeNotConcilied = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let tag = _.get(params, 'tag', ''),
      startDate = _.get(params, 'startDate') || format(new Date(), 'yyyy-MM-dd'),
      endDate = _.get(params, 'endDate') || format(new Date(), 'yyyy-MM-dd'),
      offset = _.get(params, 'offset', 0);

    logger.debug('Dashboard Contábil - list lcm not concilied => tag=%s startDate=%s endDate=%s ', tag, startDate, endDate);
    const data = await postgres.JournalEntries.listDashboardDetails(tag, startDate, endDate, offset);
    response.json(data);
  }
};


export const exportSummaryPdf = {
  method: 'get',
  run: async ({ params, models: { postgres }, user, logger, response }) => {
    logger.debug('Create report pdf params=%j', params);
    let { stream } = await generateSummaryReport(params, user);
    response.raw().setHeader('Content-type', 'application/pdf');
    stream.pipe(response.raw());
  }
};

export const conciliationCreate = { acls: [ACLS.C], ...conciliationItems.create };

export const conciliationJoin = { acls: [ACLS.C], ...conciliationItems.join };

export const conciliationListRules = { ...conciliationItems.listRules };

export const conciliationListTransactions = { ...conciliationItems.listTransactions };

export const listBillsDetails = listDetails;
