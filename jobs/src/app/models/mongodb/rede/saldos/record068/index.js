import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/saldos/record068/schema'

export default mongoose.model('cldr_rede_saldos_record068', schema, 'c_cldr_rede_saldos')