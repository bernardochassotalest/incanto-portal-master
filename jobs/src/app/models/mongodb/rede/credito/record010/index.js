import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/credito/record010/schema'

export default mongoose.model('cldr_rede_credito_record010', schema, 'c_cldr_rede_credito')