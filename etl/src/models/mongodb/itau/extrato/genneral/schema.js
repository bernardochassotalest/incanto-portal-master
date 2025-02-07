import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'banco': String,
    'ident_lancamento': {
        'code': String,
        'name': String
    },
    'tipo_inscricao': String,
    'nro_inscricao': String,
    'cod_empresa': String,
    'agencia': String,
    'dig_agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'nome_empresa': String,
    'natureza_lancamento': {
        'code': String,
        'name': String
    },
    'tipo_complemento': String,
    'data_contabil': String,
    'data_lancamento': String,
    'valor_lancamento': Number,
    'valor_saldo': Number,
    'tipo_lancamento': String,
    'categoria_lancamento': {
        'code': String,
        'name': String
    },
    'cod_fluxo_caixa': {
        'code': String,
        'name': String,
        'debit': String,
        'credit': String,
        'swift': String
    },
    'desc_historico': String,
    'adquirente': {
        'code': String,
        'name': String
    },
    'ponto_venda': String,
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'registro': 1, 'data_lancamento': 1 })
schema.index({ 'data_lancamento': 1, 'lote': 1, 'nr_sequencial': 1 })

export default schema