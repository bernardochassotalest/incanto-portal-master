import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/cielo/antecipacao/record9/schema'

export default mongoose.model('cldr_cielo_antecipacao_record9', schema, 'c_cldr_cielo_antecipacao')