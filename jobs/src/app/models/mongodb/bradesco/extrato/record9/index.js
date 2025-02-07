import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/bradesco/extrato/record9/schema'

export default mongoose.model('cldr_bradesco_extrato_record9', schema, 'c_cldr_bradesco_extrato')
