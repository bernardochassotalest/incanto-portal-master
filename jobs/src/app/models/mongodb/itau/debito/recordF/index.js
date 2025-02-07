import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/debito/recordF/schema'

export default mongoose.model('cldr_itau_debito_recordF', schema, 'c_cldr_itau_debito')
