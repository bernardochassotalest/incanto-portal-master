import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/boleto/record0/schema'

export default mongoose.model('cldr_itau_boleto_record0', schema, 'c_cldr_itau_boleto')