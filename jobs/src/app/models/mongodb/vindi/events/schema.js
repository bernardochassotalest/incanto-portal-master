import {Schema} from 'mongoose'

const schema = new Schema({
    'content': {}
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

export default schema