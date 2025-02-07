import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

schema.statics.listB1Championship = async function (params) {
	let pipeline = [],
		result = [],
		filter = {
			Championship: { $exists: true, $ne: null, $ne: {} },
		},
		group = {
			_id: "all",
			content: { $addToSet: "$Championship" },
		};

	pipeline.push({ $match: filter });
	pipeline.push({ $group: group });

	try {
		result = await this.aggregate(pipeline);
	} catch (error) {
		throw error;
	}

	return _.get(_.first(result), "content", []);
};

schema.statics.listB1Match = async function (params) {
	let pipeline = [],
		result = [],
		filter = {
			Match: { $exists: true, $ne: null, $ne: {} },
		},
		group = {
			_id: "all",
			content: { $addToSet: "$Match" },
		};

	pipeline.push({ $match: filter });
	pipeline.push({ $group: group });

	try {
		result = await this.aggregate(pipeline);
	} catch (error) {
		throw error;
	}

	return _.get(_.first(result), "content", []);
};

export default mongoose.model(
	"cldr_maxipago_daily",
	schema,
	"c_cldr_maxipago_daily"
);
