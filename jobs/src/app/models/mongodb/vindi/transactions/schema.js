import {Schema} from 'mongoose'

const EnhanceSchema = new Schema({
    'dates': {
        'created': String,
        'updated': String
    }
}, { '_id': false })

const schema = new Schema({
    '_id': String,
    'enhance': EnhanceSchema,
    'content': {},
    'history': []
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'content.id': 1 })
schema.index({ 'content.charge.id': 1 })
schema.index({ 'enhance.dates.created': 1 })
schema.index({ 'enhance.dates.updated': 1 })

export default schema