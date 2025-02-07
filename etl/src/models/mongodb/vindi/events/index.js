import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"sales_vindi_events",
	schema,
	"c_sales_vindi_events"
);
