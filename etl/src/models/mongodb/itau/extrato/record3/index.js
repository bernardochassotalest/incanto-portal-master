import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

schema.pre("save", function (next) {
	this.ponto_venda = _.padStart(this.ponto_venda, 12, "0");

	return next();
});

schema.statics.loadById = async function (_id) {
	return await this.findOne({ _id }).populate({
		path: "arquivo",
		select: "source type status fileId originalName",
	});
};

export default mongoose.model(
	"cldr_itau_extrato_record3",
	schema,
	"c_cldr_itau_extrato"
);
