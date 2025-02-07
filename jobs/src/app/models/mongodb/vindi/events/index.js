import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/vindi/events/schema'

export default mongoose.model('sales_vindi_events', schema, 'c_sales_vindi_events')