import _ from "lodash";
import mongoose from "mongoose";
import schema from "./schema";

export default mongoose.model(
	"sales_newc_transactions",
	schema,
	"c_sales_newc_transactions"
);
