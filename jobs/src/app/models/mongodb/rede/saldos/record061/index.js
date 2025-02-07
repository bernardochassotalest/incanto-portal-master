import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/saldos/record061/schema'

export default mongoose.model('cldr_rede_saldos_record061', schema, 'c_cldr_rede_saldos')