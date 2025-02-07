import Sequelize from "sequelize";
import path from "path";
import _ from "lodash";
import postgresConfig from "./../config/postgres";
import debug from "debug";

const logger = debug("incanto:postgres");
const dynamicLoad = (p) => import(p);

export default async (modelsPath) => {
	const settings = postgresConfig();

	if (!_.get(settings, "host")) {
		logger("The environment variables to start PostgreSQL, not found!");
		return;
	}
	const connection = new Sequelize(settings),
		models = await dynamicLoad(path.resolve(modelsPath, "postgres")),
		associations = _.filter(
			models,
			(model) => model.associate && typeof model.associate === "function"
		);

	_.each(models, (model) => {
		model.init(connection);
	});

	_.each(associations, (model) => {
		model.associate(connection.models);
	});

	logger(
		"PostgreSQL models initialized: %s",
		_.map(models, (r) => r.name.charAt(0).toUpperCase() + r.name.slice(1)).join(
			", "
		)
	);
	logger(
		"PostgreSQL models associations initialized: %s",
		_.map(associations, "name").join(", ")
	);

	logger("PostgreSQL connected!");

	return models;
};
