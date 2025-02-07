import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/saldos/record060/schema'

export default mongoose.model('cldr_rede_saldos_record060', schema, 'c_cldr_rede_saldos')