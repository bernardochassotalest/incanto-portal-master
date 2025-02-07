import Sequelize from 'sequelize';
import path from 'path';
import _ from 'lodash';
import { createFolder } from 'app/lib/utils';
import postgresConfig from 'app/lib/connectors/postgres-config';
import debug from 'debug';

const log = debug('incanto:postgres');
export const dynamicLoad = (p) => import(p);

export default async (modelsPath) => {
  let ATTACHMENT_FOLDER = process.env.DIR_ATTACHMENT,
    SEQUELIZE_FOLDER = `${ATTACHMENT_FOLDER}/sequelize`;

  await createFolder(SEQUELIZE_FOLDER);

  if (!_.get(postgresConfig, 'host')) {
    log('The environment variables to start PostgreSQL, not found!');
    return;
  }
  const connection = new Sequelize(postgresConfig)
    , models = await dynamicLoad(path.resolve(modelsPath, 'postgres'))
    , associations = _.filter(models, (model) => (model.associate && typeof model.associate === 'function'));

  Sequelize.postgres.DECIMAL.parse = (value) => { return parseFloat(value) };

  _.each(models, (model) => {
    model.init(connection);
  });

  _.each(associations, (model) => {
    model.associate(connection.models);
  });

  log('PostgreSQL models initialized: %s', _.map(models, (r) => r.name.charAt(0).toUpperCase() + r.name.slice(1)).join(', '));
  log('PostgreSQL models associations initialized: %s', _.map(associations, 'name').join(', '));

  log('PostgreSQL connected!');
}
