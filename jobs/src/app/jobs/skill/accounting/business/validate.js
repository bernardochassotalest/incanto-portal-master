import _ from 'lodash'
import debug from 'debug';
import { md5, getTimeLog } from 'app/lib/utils';
import { postgres } from 'app/models';

const log = debug('incanto:skill:accounting:generate');

export const validateMapping = async (refDate) => {
  let rows = await postgres.SourceMapping.listValidate({refDate});

  log(`validateMapping: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      model = {
        date: refDate,
        messageId: 'itemMapping',
        sourceName: _.get(item, 'source', ''),
        sourceDb: 'sourceMappings',
        sourceId: _.get(item, 'id', ''),
        isActive: true
      };
    model['id'] = md5(`${model.date}-${model.messageId}-${model.sourceId}`);

    let found = await postgres.ConciliationMessages.findOne({where: {id: model.id}});

    if (!found) {
      await postgres.ConciliationMessages.create(model);
    } else {
      await postgres.ConciliationMessages.update({isActive: true}, {where: {id: model.id}});
    }
  }

  return rows.length;
}

export const validateAccountConfig = async (refDate) => {
  let rows = await postgres.AccountConfigs.listValidate({refDate});

  log(`validateAccountConfig: ${refDate}`);

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      model = {
        date: refDate,
        messageId: 'accountingConfig',
        sourceName: _.get(item, 'source', ''),
        sourceDb: 'accountConfigs',
        sourceId: _.get(item, 'id', ''),
        isActive: true
      };
    model['id'] = md5(`${model.date}-${model.messageId}-${model.sourceId}`);

    let found = await postgres.ConciliationMessages.findOne({where: {id: model.id}});

    if (!found) {
      await postgres.ConciliationMessages.create(model);
    }
  }

  return rows.length;
}
