import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"cldr_itau_boleto_record1",
	schema,
	"c_cldr_itau_boleto"
);
