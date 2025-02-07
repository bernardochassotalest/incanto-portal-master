import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/vindi/products/schema'

export default mongoose.model('sales_vindi_products', schema, 'c_sales_vindi_products')