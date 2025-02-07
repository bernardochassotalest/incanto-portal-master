import _ from 'lodash';
import { BaseError } from 'sequelize';
import { getYesterdayDate } from 'commons/helper';
import { getArrayFromText } from 'libs/framework/http/helper';
import { md5 } from 'commons/tools';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const create = {
  method: 'post',
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Conciliation creating %j', params);

    const id = _.get(params, 'id', ''),
      notes = _.get(params, 'notes', ''),
      found = await models.postgres.ConciliationItems.findOne({where: { id }});

    if (!found) {
      throw new ApiError('Não foi encontrado um item para conciliar.');
    }

    let idData = md5(`${id}-adjust`),
      exists = await models.postgres.ConciliationItems.findOne({where: {id: idData}});

    if (exists) {
      throw new ApiError('Lançamento de ajuste já foi inserido.');
    }

    let debit = _.get(found, 'debit', 0),
      credit = _.get(found, 'credit', 0),
      balance = _.get(found, 'balance', 0),
      data = {
        id: idData,
        date: _.get(found, 'date', ''),
        rule: _.get(found, 'rule', ''),
        sourceName: 'manual',
        sourceDb: 'conciliationItems',
        sourceId: id,
        pointOfSale: _.get(found, 'pointOfSale', ''),
        keyCommon: _.get(found, 'keyCommon', ''),
        keyTid: _.get(found, 'keyTid', ''),
        keyNsu: _.get(found, 'keyNsu', ''),
        credit: debit,
        debit: credit,
        balance: (-1 * balance)
      },
      conciliationId = uuidv4(),
      concSource = {
        conciliationItemId: id,
        keyId: conciliationId,
        isManual: 'true',
        userId: _.get(user, 'id', ''),
        notes: notes
      },
      concGenerate = {
        conciliationItemId: idData,
        keyId: conciliationId,
        isManual: 'true',
        userId: _.get(user, 'id', ''),
        notes: notes
      };

    let transaction = await models.postgres.ConciliationItems.sequelize.transaction();

    try {
      const inserted = await models.postgres.ConciliationItems.create(data, { transaction });
      await models.postgres.ConciliationKeys.create(concSource, { transaction });
      await models.postgres.ConciliationKeys.create(concGenerate, { transaction });

      data = { ...data, id: inserted.get('id') }

      transaction.commit();
    } catch(err) {
      transaction.rollback();
      throw (err instanceof BaseError) ? new ApiError(`DB Failure ${err}`) : err;
    }

    logger.debug('Conciliation created %j', data);
    response.json({conciliationId});
  },
};

export const join = {
  method: 'post',
  run: async ({ params, models, user, logger, response }) => {
    logger.debug('Conciliation joining %j', params);

    const ids = _.get(params, 'ids') || [];

    if (_.isEmpty(ids) == true) {
      throw new ApiError('Ids para conciliação devem ser informados.');
    }

    const check = await models.postgres.ConciliationItems.checkBalance(ids),
      notes = _.get(params, 'notes', '');

    if (check.count != ids.length) {
      throw new ApiError('Não foram encontrados todos os ids informados para conciliação.');
    }
    if (_.round(check.balance, 2) != 0) {
      throw new ApiError(`O saldo de conciliação dos ids informados não estão fechados [${check.balance}].`);
    }

    let transaction = await models.postgres.ConciliationItems.sequelize.transaction(),
      conciliationId = uuidv4();

    try {
      for (let i = 0; i < ids.length; i++) {
        let row = ids[i],
          concData = {
            conciliationItemId: row,
            keyId: conciliationId,
            isManual: 'true',
            userId: _.get(user, 'id', ''),
            notes: notes
          };

        await models.postgres.ConciliationKeys.upsert(concData, { transaction });
      }

      transaction.commit();
    } catch(err) {
      transaction.rollback();
      throw (err instanceof BaseError) ? new ApiError(`DB Failure ${err}`) : err;
    }

    logger.debug('Conciliation created %j', { ids, conciliationId });

    response.json({conciliationId});
  },
};

export const listRules = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    logger.debug('Conciliation - finding rules => term=%s', params.term || '' );
    const canConciliation = (_.get(_.find(getArrayFromText(user.permissions), {'code':'A18'}), 'perms') || []).includes('C');
    const data = await postgres.ConciliationRules.finding({ ...params, canConciliation });
    response.json(data);
  },
};

export const listTransactions = {
  method: 'get',
  run: async ({ params, models: { postgres }, logger, user, response }) => {
    let rule = _.get(params, 'rule', ''),
      startDate = _.get(params, 'startDate', ''),
      endDate = _.get(params, 'endDate', '');
    if (_.isEmpty(rule) == true) {
      throw new ApiError('Regra de conciliação deve ser informada.');
    }
    if (_.isEmpty(startDate) == true) {
      throw new ApiError('Data de início deve ser informada.');
    }
    if (_.isEmpty(endDate) == true) {
      throw new ApiError('Data de término deve ser informada.');
    }
    if (endDate > getYesterdayDate()) {
      endDate = getYesterdayDate();
    }
    logger.debug('Conciliation - finding transactions => rule=%s', rule, startDate, endDate );
    const data = await postgres.ConciliationItems.listTransactions(rule, startDate, endDate);
    response.json(data);
  },
};
