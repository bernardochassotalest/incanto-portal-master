import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/bradesco/extrato/record5/schema'

export default mongoose.model('cldr_bradesco_extrato_record5', schema, 'c_cldr_bradesco_extrato')
