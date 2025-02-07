import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"sales_multiclubes_payments",
	schema,
	"c_sales_multiclubes_payments"
);
