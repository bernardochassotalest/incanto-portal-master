import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/cielo/saldos/record1/schema'

export default mongoose.model('cldr_cielo_saldos_record1', schema, 'c_cldr_cielo_saldos')