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
    'vl_gorjeta': Number,
    'nro_cartao': String,
    'status_cv_nsu': {
        'code': String,
        'name': String
    },
    'nro_parcelas': String,
    'nro_cv_nsu': String,
    'tid': String,
    'nro_pedido': String,
    'nro_referencia': String,
    'taxa_comissao': Number,
    'vl_desconto': Number,
    'nro_autorizacao': String,
    'hora_transacao': String,
    'tipo_captura': {
        'code': String,
        'name': String
    },
    'vl_liquido': Number,
    'vl_primeira_parcela': Number,
    'vl_demais_parcelas': Number,
    'dt_credito': String,
    'nro_terminal': String,
    'sigla_pais': {
        'code': String,
        'name': String
    },
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