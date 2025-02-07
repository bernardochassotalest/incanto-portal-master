import mongoose from "mongoose";
import Promise from "bluebird";
import debug from "debug";
import path from "path";
import _ from "lodash";
import mongoConfig from "../config/mongodb";

const logger = debug("incanto:mongo");
const dynamicLoad = (p) => import(p);

export default async (modelsPath) => {
	const settings = mongoConfig();

	if (!settings.url) {
		logger("The environment variables to start MongoDb, not found!");
		return;
	}

	await mongoose.connect(settings.url, settings.options);
	mongoose.Promise = Promise;
	const models = await dynamicLoad(path.resolve(modelsPath, "mongodb"));

	logger("MongoDb models initialized: %s", _.keys(models).join(", "));
	logger("MongoDb connected!");

	return models;
};
