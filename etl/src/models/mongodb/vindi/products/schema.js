import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'content': {}
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'content.id': 1 })

export default schema