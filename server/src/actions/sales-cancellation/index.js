import _ from 'lodash';
import { ACLS, ACCOUNT_TYPES } from 'commons/constants';
import { BaseError, Op } from 'sequelize';
import { startOfDay, parseISO, endOfDay } from 'date-fns';

export const INCLUDE_ACL = {
  code: 'A15',
  permissions: [ACLS.W],
  label: 'Vendas Canceladas',
  icon: 'MdRemoveShoppingCart',
  // group: 'Operação',
  // groupIcon: 'MdAirplay',
  accounts: [ACCOUNT_TYPES.SYSTEM],
};

export const load = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Load Cancellation Models params=%j', params);
    let where = { saleId: params.id },
      include = [
        { as: 'user', model: postgres.User, attributes: ['id', 'name'] },
        { as: 'model', model: postgres.CancellationModel, attributes: ['id', 'name', 'tag'] },
      ];
    let data = await postgres.SaleCancellation.findOne({ where, include });
    response.json(data || where);
  }
};

export const list = {
  method: 'post',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Sales Cancellation offset=%s, term=%s', params.offset || 0, params.term || '' );
    let limit = PAGE_SIZE,
      offset = isNaN(params.offset) ? 0 : params.offset * 1,
      order = [['refDate', 'DESC']],
      attributes = ['id', 'sourceId', 'refDate', 'dueDate', 'tag', 'amount', 'createdAt'],
      where = { status: 'canceled' },
      include = [
        {
          as: 'cancellation',
          attributes: ['saleId'],
          model: postgres.SaleCancellation,
          include: [
            { as: 'user', model: postgres.User, attributes: ['id', 'name'] }
          ]
        },
        { as: 'customer', model: postgres.Customer, attributes: ['id', 'name', 'vatNumber'] }
      ];

    if (params.refDateStart && params.refDateEnd) {
      where['refDate'] = {
        [Op.between]: [ startOfDay(parseISO(params.refDateStart)), endOfDay(parseISO(params.refDateEnd)) ]
      };
    }
    if (params.dueDateStart && params.dueDateEnd) {
      where['dueDate'] = {
        [Op.between]: [ startOfDay(parseISO(params.dueDateStart)), endOfDay(parseISO(params.dueDateEnd)) ]
      };
    }
    if (params.hasJustify === 'true') {
      include[0].required = true;
      include[0].where = { 'userId': { [Op.not]: null } };
    }
    if (params.hasJustify === 'false') {
      include[0].required = false;
      include[0].where = { 'userId': { [Op.is]: null } };
    }
    if (params.userId) {
      include[0].required = true;
      include[0].where = { 'userId': params.userId };
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }

    let { count = 0, rows = [] } = await postgres.Sale.findAndCountAll({ where, attributes, include, offset, limit, order, distinct: true });
    response.json({ rows, offset, count, limit });
  }
};

export const createOrUpdate = {
  method: 'post',
  acls: [ACLS.W],
  run: async ({ params, models: { postgres}, logger, user, response }) => {
    logger.debug('Sales Cancellation creating/updating %j', params);

    let where = { saleId: params.saleId },
      values = {
        saleId: params.saleId,
        notes: params.notes,
        modelId: _.get(params, 'model.id')
      }

    let found = await postgres.SaleCancellation.findOne({ where, attributes: ['saleId'] });

    if (!found) {
      await postgres.SaleCancellation.create({ ...values, userId: user.id });
    } else {
      await postgres.SaleCancellation.update(values, { where });
    }
    response.json({ error: false });
  }
};

export const listUsers = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Sales Cancellation - finding user => term=%s', params.term || '');
    const data = await postgres.User.finding(params);
    response.json(data);
  },
};

export const listCancellationTypes = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Sales Cancellation - finding cancellation types => term=%s', params.term || '');
    const data = await postgres.CancellationModel.finding(params);
    response.json(data);
  },
};
