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
    'tipo_arquivo': String,
    'registro': String,
    'nro_linha': String,
    'estabelecimento': String,
    'nro_ro': String,
    'nro_resumo': String,
    'nro_cartao': String,
    'dt_apresentacao': String,
    'dt_venda_ajuste': String,
    'sinal_parcela': String,
    'vl_parcela': Number,
    'parcela': String,
    'total_parcela': String,
    'motivo_rejeicao': {
        'code': String,
        'name': String
    },
    'cod_autorizacao': String,
    'tid': String,
    'nro_nsu_doc': String,
    'vl_complementar': Number,
    'digitos_cartao': String,
    'vl_total_venda': Number,
    'vl_proxima_parcela': Number,
    'vl_transacao': Number,
    'taxa_comissao': Number,
    'vl_comissao': Number,
    'vl_liquido': Number,
    'nro_nota_fiscal': String,
    'ind_cartao_emitido': {
        'code': String,
        'name': String
    },
    'nro_terminal': String,
    'ind_taxa_entrada': {
        'code': String,
        'name': String
    },
    'nro_pedido': String,
    'hr_transacao': String,
    'nro_transacao': String,
    'ind_cielo': String,
    'modo_entrada_cartao': {
        'code': String,
        'name': String
    },
    'codigo_venda': String,
    'cod_interno_ajuste': String,
    'tipo_produto': {
        'code': String,
        'name': String,
        'kind': String
    },
    'bandeira': {
        'code': String,
        'name': String
    },
    'status_lancamento': String,
    'cielo_key_group': String,
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