import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/cielo/vendas/record0/schema'

export default mongoose.model('cldr_cielo_vendas_record0', schema, 'c_cldr_cielo_vendas')