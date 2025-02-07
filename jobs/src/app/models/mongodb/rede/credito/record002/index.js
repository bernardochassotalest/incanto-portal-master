import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/credito/record002/schema'

export default mongoose.model('cldr_rede_credito_record002', schema, 'c_cldr_rede_credito')