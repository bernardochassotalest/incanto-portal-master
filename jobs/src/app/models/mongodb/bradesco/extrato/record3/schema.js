import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_keyCommon': String,
    '_conciliationType': String,
    'nro_linha': String,
    'banco': String,
    'lote': String,
    'registro': String,
    'nr_sequencial': String,
    'cod_segmento': String,
    'ident_lancamento': {
        'code': String,
        'name': String
    },
    'tipo_inscricao': {
        'code': String,
        'name': String
    },
    'nro_inscricao': String,
    'cod_empresa': String,
    'agencia': String,
    'dig_agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'dig_agencia_conta': String,
    'nome_empresa': String,
    'uso_banco': String,
    'natureza_lancamento': {
        'code': String,
        'name': String
    },
    'tipo_complemento': {
        'code': String,
        'name': String
    },
    'complemento': String,
    'isento_cpmf': {
        'code': String,
        'name': String
    },
    'data_contabil': String,
    'data_lancamento': String,
    'valor_lancamento': Number,
    'valor_saldo': Number,
    'tipo_lancamento': String,
    'categoria_lancamento': {
        'code': String,
        'name': String
    },
    'cod_lancamento': String,
    'desc_historico': String,
    'nro_documento': String,
    'segunda_linha': String,
    'adquirente': {
        'code': String,
        'name': String
    },
    'ponto_venda': String,
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
