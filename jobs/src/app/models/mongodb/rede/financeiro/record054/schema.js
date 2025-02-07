import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_key': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_rv_original': String,
    'nro_cartao': String,
    'nro_pv_original': String,
    'dt_transacao': String,
    'nro_nsu': String,
    'vl_original': Number,
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