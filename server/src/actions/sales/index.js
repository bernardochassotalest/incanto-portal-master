import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { startOfDay, parseISO, endOfDay } from 'date-fns';

export const INCLUDE_ACL = {
  code: 'A19',
  permissions: [ACLS.W],
  label: 'Vendas',
  icon: 'FaFileInvoiceDollar',
  group: 'Relatórios',
  groupIcon: 'FaRegFileAlt',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const list = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    const types = {
        'period': 'Período',
        'customerId': 'Cliente',
        'itemCode': 'Produto',
        'sourceId': 'Nr.Fatura',
        'transId': 'Lançamento Contábil',
        'ourNumber': 'Boleto:Nosso Número',
        'authorization': 'Cartão:Autorização',
        'nsu': 'Cartão:NSU',
        'tid': 'Cartão:TID',
      },
      type = _.get(params, 'type', ''),
      startDate = _.get(params, 'startDate', ''),
      endDate = _.get(params, 'endDate', ''),
      term = _.trim(_.get(params, 'term', '')),
      offset = params.offset || 0;

    logger.debug('Sales type=%s term=%s startDate=%s endDate=%s offset=%s', type, term, startDate, endDate, offset);
    if (_.includes(_.keys(types), type) == false) {
      throw new ApiError('Informe um tipo de filtro válido.');
    }
    if (type == 'period') {
      if (_.isEmpty(startDate) == true) {
        throw new ApiError('Data de início deve ser informada.');
      }
      if (_.isEmpty(endDate) == true) {
        throw new ApiError('Data de término deve ser informada.');
      }
    } else {
      if (_.isEmpty(term) == true) {
        throw new ApiError('Termo de busca deve ser informado.');
      }
    }
    const data = await postgres.Sale.listFiltered({ type, term, startDate, endDate, offset }, user);
    response.json(data);
  }
};

export const listDetails = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    const saleId = _.get(params, 'saleId', '');
    if (_.isEmpty(saleId) == true) {
      throw new ApiError('Id da Venda deve ser informado.');
    }
    logger.debug('Sales Detail saleId=%s', saleId);
    const data = await postgres.Sale.listDetails(saleId);
    response.json(data);
  }
};

export const listCustomers = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Customers - finding customers => params=%j', params);
    const data = await postgres.Customer.finding(params);
    response.json(data);
  },
};

export const listProducts = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Products - finding products => params=%j', params);
    const data = await postgres.SaleItem.findingProduct(params);
    response.json(data);
  },
};
