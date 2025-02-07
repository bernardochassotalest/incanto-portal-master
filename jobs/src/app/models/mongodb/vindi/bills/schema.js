import {Schema} from 'mongoose'

const EnhanceSchema = new Schema({
    'dates': {
        'issued': String,
        'due': String,
        'paid': String,
        'canceled': String
    },
    'items_amount': Number
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
schema.index({ 'enhance.dates.issued': 1, 'content.customer.id': 1 })
schema.index({ 'enhance.dates.due': 1, 'content.customer.id': 1 })
schema.index({ 'enhance.dates.paid': 1, 'content.customer.id': 1 })
schema.index({ 'enhance.dates.canceled': 1, 'content.customer.id': 1 })

export default schema