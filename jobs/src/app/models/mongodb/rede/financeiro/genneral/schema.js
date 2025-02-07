import {Schema} from 'mongoose'

const schema = new Schema({})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'registro': 1, 'dt_lancamento': 1 }, { 'sparse': 1 })

export default schema