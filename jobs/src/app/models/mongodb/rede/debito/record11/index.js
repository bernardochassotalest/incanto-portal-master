import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/debito/record11/schema'

export default mongoose.model('cldr_rede_debito_record11', schema, 'c_cldr_rede_debito')