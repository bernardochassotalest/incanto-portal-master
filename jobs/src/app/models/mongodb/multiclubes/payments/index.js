import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/multiclubes/payments/schema'

export default mongoose.model('sales_multiclubes_payments', schema, 'c_sales_multiclubes_payments')