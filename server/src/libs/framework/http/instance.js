import * as helper from 'libs/framework/http/helper';
import * as routes from 'libs/framework/http/routes';
import mongoConnector from 'libs/framework/connectors/mongoose-connector';
import postgresConnector from 'libs/framework/connectors/postgres-connector';
import FieldValidationError from 'libs/framework/errors/field-validation';
import ApiError from 'libs/framework/errors/api';

global.FieldValidationError = FieldValidationError;
global.ApiError = ApiError;
global.PAGE_SIZE = process.env.PAGE_SIZE * 1

export default async function(options) {
  const { name = 'AppName', logger = {}, actions, models } = options,
    tracer = helper.logger(logger, name),
    {app, server} = helper.server();

  if (models) {
    await mongoConnector(tracer, models);
    await postgresConnector(tracer, models);
  }
  await routes.register(tracer, name, options, app, actions, models);

  app.run(tracer, (process.env.HTTP_PORT || 8080), name);
}
