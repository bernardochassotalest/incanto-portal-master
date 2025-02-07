import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/debito/record05/schema'

export default mongoose.model('cldr_rede_debito_record05', schema, 'c_cldr_rede_debito')