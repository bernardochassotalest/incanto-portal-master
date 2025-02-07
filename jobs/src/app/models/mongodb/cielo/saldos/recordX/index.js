import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/cielo/saldos/recordX/schema'

export default mongoose.model('cldr_cielo_saldos_recordX', schema, 'c_cldr_cielo_saldos')