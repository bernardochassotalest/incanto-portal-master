import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_resumo_venda': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'tipo_plano': String,
    'tag': String,
    'nro_pv_centralizador': String,
    'nro_documento': String,
    'dt_lancamento': String,
    'vl_lancamento': Number,
    'tipo_ajuste': {
        'code': String,
        'name': String
    },
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'dt_movimento': String,
    'nro_rv': String,
    'data_rv': String,
    'bandeira': {
        'code': String,
        'name': String
    },
    'tipo_transacao': String,
    'vl_bruto': Number,
    'taxa_comissao': Number,
    'vl_desconto': Number,
    'vl_a_receber': Number,
    'taxa_administracao': Number,
    'nro_parcela': String,
    'status_credito': {
        'code': String,
        'name': String
    },
    'nro_pv_original': String,
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

schema.index({ '_resumo_venda': 1 })

export default schema