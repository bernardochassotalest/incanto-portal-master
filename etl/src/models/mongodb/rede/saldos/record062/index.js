import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"cldr_rede_saldos_record062",
	schema,
	"c_cldr_rede_saldos"
);
