import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/financeiro/record035/schema'

export default mongoose.model('cldr_rede_financeiro_record035', schema, 'c_cldr_rede_financeiro')