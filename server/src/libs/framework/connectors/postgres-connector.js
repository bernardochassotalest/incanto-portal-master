import postgresConfig from "libs/framework/connectors/postgres-config";
import { dynamicLoad } from "libs/framework/http/helper";
import _ from "lodash";
import path from "path";
import Sequelize from "sequelize";

export default async (logger, modelsPath) => {
  if (!_.get(postgresConfig, "host") && process.env.NODE_ENV === "production") {
    logger.warn("The environment variables to start PostgreSQL, not found!");
    return;
  }
  const connection = new Sequelize(postgresConfig),
    models = await dynamicLoad(path.resolve(modelsPath, "postgres")),
    associations = _.filter(
      models,
      (model) => model.associate && typeof model.associate === "function"
    );

  Sequelize.postgres.DECIMAL.parse = (value) => { return parseFloat(value); };

  _.each(models, (model) => {
    model.init(connection);
  });
 
  _.each(associations, (model) => {
    model.associate(connection.models);
  });

  logger.debug(
    "PostgreSQL models initialized: %s",
    _.map(models, (r) => r.name.charAt(0).toUpperCase() + r.name.slice(1)).join(
      ", "
    )
  );
  logger.debug(
    "PostgreSQL models associations initialized: %s",
    _.map(associations, "name").join(", ")
  );

  logger.info("PostgreSQL connected!");
};
