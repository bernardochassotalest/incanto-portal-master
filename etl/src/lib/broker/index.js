import _ from "lodash";
import debug from "debug";
import * as Broker from "./broker";

const logger = debug("incanto:broker.receivers");

const load = async (directory) => import(directory);

const start = (runners, broker, models) => {
	_.each(runners, (runner) => {
		const { queue, register } = runner;

		if (!_.isString(queue) || !_.isFunction(register)) {
			throw new Error(
				`[${key}]: queue property and register method is required`
			);
		}

		logger(`Queue ${queue} is registred`);

		broker.subscribe(queue, (data) => {
			const { ack } = data;
			register({
				data,
				models,
				logger: debug(`incanto:${queue}`),
				publish: broker.publish.bind(broker),
				done: () => {
					ack && ack(data);
				},
			});
		});
	});
};

const receivers = async (directory, models) => {
	const url = process.env.QUEUE_URL && String(process.env.QUEUE_URL);

	if (_.isEmpty(url)) {
		throw new Error(
			"url to Rabbitmq is required (amqp://user:password@host:port)"
		);
	}

	start(await load(directory), Broker.instance(url), models);
};

export { receivers };
