import {Schema} from 'mongoose'

const keysSchema = new Schema({
    'Nsu': String,
    'Tid': String,
    'Authorization': String,
    'Reference': String,
    'BatchGroup': String
}, { '_id': false })

const schema = new Schema({
    '_id': String,
    '_resumo_venda': String,
    '_keys': keysSchema,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_pv': String,
    'nro_rv': String,
    'data': String,
    'vl_bruto': Number,
    'taxa_comissao': Number,
    'vl_desconto': Number,
    'vl_liquido': Number,
    'nro_cartao': String,
    'tipo_transacao': {
        'code': String,
        'name': String
    },
    'nro_cv': String,
    'tid': String,
    'nro_pedido': String,
    'dt_credito': String,
    'status_transacao': {
        'code': String,
        'name': String
    },
    'hora_transacao': String,
    'nro_terminal': String,
    'tipo_captura': {
        'code': String,
        'name': String
    },
    'vl_compra': Number,
    'vl_saque': Number,
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

schema.index({ '_resumo_venda': 1 })

export default schema