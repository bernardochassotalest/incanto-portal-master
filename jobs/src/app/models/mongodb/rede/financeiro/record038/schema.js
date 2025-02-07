import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_key': String,
    '_resumo_venda': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'tag': String,
    'nro_pv': String,
    'nro_documento': String,
    'dt_emissao': String,
    'vl_debito': Number,
    'tipo_ajuste': {
        'code': String,
        'name': String
    },
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'nro_rv_original': String,
    'dt_rv_original': String,
    'vl_credito_original': Number,
    'motivo_debito_cod': String,
    'motivo_debito_desc': String,
    'nro_cartao': String,
    'nro_carta': String,
    'mes_referencia': String,
    'dt_carta': String,
    'vl_cancelamento': Number,
    'nro_processo': String,
    'nro_pv_original': String,
    'data_transacao': String,
    'nro_nsu': String,
    'tid': String,
    'nro_pedido': String,
    'nro_resumo_debito': String,
    'dt_debito': String,
    'vl_original': Number,
    'nro_autorizacao': String,
    'tipo_debito': String,
    'vl_debito_total': Number,
    'vl_pendente': Number,
    'bandeira_rv_origem': {
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

export default schema