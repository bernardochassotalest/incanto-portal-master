import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/debito/recordH/schema'

export default mongoose.model('cldr_itau_debito_recordH', schema, 'c_cldr_itau_debito')
