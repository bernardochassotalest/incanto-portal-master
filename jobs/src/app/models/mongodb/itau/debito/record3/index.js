import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/debito/record3/schema'

export default mongoose.model('cldr_itau_debito_record3', schema, 'c_cldr_itau_debito')
