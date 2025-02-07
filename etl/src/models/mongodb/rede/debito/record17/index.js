import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"cldr_rede_debito_record17",
	schema,
	"c_cldr_rede_debito"
);
