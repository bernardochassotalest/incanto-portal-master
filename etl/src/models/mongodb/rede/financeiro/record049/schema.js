import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_key': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_pv_original': String,
    'nro_rv_original': String,
    'nro_referencia': String,
    'dt_credito': String,
    'vl_novo': Number,
    'vl_original': Number,
    'vl_ajuste': Number,
    'dt_cancelamento': String,
    'vl_rv': Number,
    'vl_cancelamento': Number,
    'nro_cartao': String,
    'dt_transacao': String,
    'nro_nsu': String,
    'tid': String,
    'nro_pedido': String,
    'tipo_debito': String,
    'nro_parcela': String,
    'bandeira': {
        'code': String,
        'name': String
    },
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