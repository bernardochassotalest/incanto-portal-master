import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

schema.statics.listForLink = async function (ids) {
	let pipeline = [],
		filter = {
			UserId: { $in: ids },
		},
		project = {
			_id: 0,
			UserId: 1,
			AccountId: 1,
			Identifier: 1,
			FirstName: 1,
			LastName: 1,
			Email: 1,
			VatNumber: 1,
			ContractNumber: 1,
			RegistryNumber: 1,
			Role: 1,
			ClientType: 1,
			BusinessAccount: 1,
		},
		result = [];

	pipeline.push({ $match: filter });
	pipeline.push({ $project: project });

	try {
		result = await this.aggregate(pipeline);
	} catch (error) {
		throw error;
	}

	return result;
};

export default mongoose.model(
	"sales_newc_clients",
	schema,
	"c_sales_newc_clients"
);
