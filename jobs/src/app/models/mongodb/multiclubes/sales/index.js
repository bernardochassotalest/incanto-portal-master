import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/multiclubes/sales/schema'

export default mongoose.model('sales_multiclubes_sales', schema, 'c_sales_multiclubes_sales')