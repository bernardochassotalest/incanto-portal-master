import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/debito/recordZ/schema'

export default mongoose.model('cldr_itau_debito_recordZ', schema, 'c_cldr_itau_debito')
