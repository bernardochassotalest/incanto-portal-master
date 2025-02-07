import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/skill/pos-config/schema'

schema.statics.loadAll = async function() {
    let fields = {
            'Source': 1,
            'Code': 1,
            'Acquirer': 1,
            'PointOfSale': 1,
            'Bank': 1,
            'Branch': 1,
            'Account': 1,
            'DigitAccount': 1,
            'Tag': 1,
        },
        list = [];

    try {
        list = await this.find({}, fields)
    } catch (error) {
        throw error
    }
    return list
}

export default mongoose.model('cldr_pos_config', schema, 'c_cldr_pos_config')
