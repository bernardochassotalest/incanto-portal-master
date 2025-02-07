import {Schema} from 'mongoose'

const schema = new Schema({
    'userId': String,
    'email': String,
    'name': String,
    'date': String,
    'account': {
        'id': String,
        'accountType': String,
        'name': String,
        'active': Boolean,
    },
    'profile': {
        'id': String,
        'name': String,
        'permissions': String,
        'tags': [String],
    },
    'accessInfo': {}
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'email': 1 })

export default schema
