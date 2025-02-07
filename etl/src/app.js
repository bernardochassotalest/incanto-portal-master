import MoongosePlugins from './lib/connectors/mongoose-plugins'
MoongosePlugins()

import _ from "lodash";
import { resolve } from "path";
import { config } from "dotenv";
import { getEnviromentFile } from "./lib/helper";
import * as Broker from "./lib/broker";
import { PostgresConnector, MongoDBConnector } from "./lib/connectors";

export default class App {
	constructor(options) {
		this.options = options;
		config({ path: getEnviromentFile() });
	}

	async start() {
		const receiversPath = _.get(this.options, "receivers");
		const modelsPath = _.get(this.options, "models");

		if (!receiversPath) {
			throw new Error(`receivers path is required`);
		}

		if (!modelsPath) {
			throw new Error(`models path is required`);
		}

		const directoryModels = resolve(modelsPath);
		const postgres = await PostgresConnector(directoryModels);
		const mongodb = await MongoDBConnector(directoryModels);

		Broker.receivers(resolve(receiversPath), { postgres, mongodb});
	}
}
