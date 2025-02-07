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
    '_resumo_venda': String,
    '_resumo_original': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_parcela': String,
    'tipo_plano': String,
    'tag': String,
    'nro_pv_ajustado': String,
    'nro_rv_ajustado': String,
    'dt_ajuste': String,
    'vl_ajuste': Number,
    'tipo_ajuste': {
        'code': String,
        'name': String
    },
    'motivo_ajuste_cod': String,
    'motivo_ajuste_desc': String,
    'nro_cartao': String,
    'dt_transacao': String,
    'nro_rv_original': String,
    'nro_carta': String,
    'dt_carta': String,
    'mes_referencia': String,
    'nro_pv_original': String,
    'dt_rv_original': String,
    'vl_transacao': Number,
    'tipo_movimento': {
        'code': String,
        'name': String
    },
    'dt_credito': String,
    'vl_bruto_resumo': Number,
    'vl_cancelamento': Number,
    'nro_nsu': String,
    'tid': String,
    'nro_pedido': String,
    'nro_autorizacao': String,
    'tipo_debito': String,
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'nro_ordem_debito': String,
    'vl_debito': Number,
    'vl_pendente': Number,
    'bandeira_rv_origem': {
        'code': String,
        'name': String
    },
    'bandeira_rv_ajustado': {
        'code': String,
        'name': String
    },
    'modelo_lancamento': String,
    'tipo_lancamento': String,
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
schema.index({ '_resumo_original': 1 })

export default schema