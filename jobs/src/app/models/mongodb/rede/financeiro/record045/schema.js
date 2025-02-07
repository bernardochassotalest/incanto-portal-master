import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_key': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_pv': String,
    'nro_ordem_debito': String,
    'dt_ordem_debito': String,
    'vl_ordem_debito': Number,
    'motivo_ajuste_cod': String,
    'motivo_ajuste_desc': String,
    'nro_cartao': String,
    'nro_cv_nsu': String,
    'tid': String,
    'nro_pedido': String,
    'data_cv': String,
    'nro_autorizacao': String,
    'vl_original': Number,
    'nro_rv_original': String,
    'dt_rv_original': String,
    'nro_pv_original': String,
    'nro_carta': String,
    'dt_carta': String,
    'nro_chargeback': String,
    'mes_referencia': String,
    'vl_liquidado': Number,
    'dt_liquidacao': String,
    'nro_retencao': String,
    'meio_compensacao_cod': String,
    'meio_compensacao_desc': String,
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