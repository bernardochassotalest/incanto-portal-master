import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/itau/extrato/record0/schema'

schema.statics.loadById = async function(_id) {
    return await this.findOne({_id})
        .populate({
            path: 'arquivo',
            select: 'source type status fileId originalName'
        })
}

export default mongoose.model('cldr_itau_extrato_record0', schema, 'c_cldr_itau_extrato')