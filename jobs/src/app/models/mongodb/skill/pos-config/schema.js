import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'Source': String,
    'RefField': String,
    'Code': String,
    'Acquirer': {
        'Code': String,
        'Name': String
    },
    'PointOfSale': String,
    'Bank': String,
    'Branch': String,
    'Account': String,
    'DigitAccount': String,
    'Tag': String
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'Source': 1, 'Code': 1 })

export default schema
