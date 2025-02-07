import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/vindi/issues/schema'

export default mongoose.model('sales_vindi_issues', schema, 'c_sales_vindi_issues')