import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"cldr_cielo_antecipacao_recordX",
	schema,
	"c_cldr_cielo_antecipacao"
);
