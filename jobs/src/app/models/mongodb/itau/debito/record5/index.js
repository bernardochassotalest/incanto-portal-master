import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/debito/record5/schema'

export default mongoose.model('cldr_itau_debito_record5', schema, 'c_cldr_itau_debito')
