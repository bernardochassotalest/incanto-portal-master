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
    '_keys': keysSchema,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'tag': String,
    'nro_pv': String,
    'nro_rv': String,
    'nro_cartao': String,
    'vl_transacao': Number,
    'dt_transacao': String,
    'referencia': String,
    'nro_processo': String,
    'nro_cv_nsu': String,
    'tid': String,
    'nro_pedido': String,
    'nro_autorizacao': String,
    'cod_request': {
        'code': String,
        'name': String,
        'documents': String
    },
    'dt_limite': String,
    'bandeira': {
        'code': String,
        'name': String
    },
    'livre': String,
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

schema.virtual('summary', {
    'ref': 'cldr_summary',
    'localField': '_summary_id',
    'foreignField': '_id',
    'justOne': true,
})

schema.index({ '_summary_id': 1 })

export default schema