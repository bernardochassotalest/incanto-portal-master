import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_key': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_pv': String,
    'nro_rv': String,
    'nro_cartao': String,
    'data': String,
    'nro_cv_nsu': String,
    'nro_autorizacao': String,
    'tid': String,
    'nro_pedido': String,
    'id_arquivo': {
        'type': Schema.Types.ObjectId,
        'ref': 'cldr_files',
        'required': [true, 'Arquivo do registro deve ser informado']
    },
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.virtual('arquivo', {
    'ref': 'cldr_files',
    'localField': 'id_arquivo',
    'foreignField': '_id',
    'justOne': true,
})

export default schema