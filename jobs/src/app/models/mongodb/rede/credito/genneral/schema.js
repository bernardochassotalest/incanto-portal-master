import {Schema} from 'mongoose'

const schema = new Schema({})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ '_resumo_venda': 1 })

export default schema