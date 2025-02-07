import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/cielo/pagamentos/record9/schema'

export default mongoose.model('cldr_cielo_pagamentos_record9', schema, 'c_cldr_cielo_pagamentos')