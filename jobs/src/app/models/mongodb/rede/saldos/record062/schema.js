import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_resumo_venda': String,
    'registro': String,
    'nro_linha': String,
    'tipo_plano': String,
    'tag': String,
    'nro_ordem_credito': String,
    'tipo_ajuste': {
        'code': String,
        'name': String
    },
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'dt_vencimento': String,
    'estabelecimento': String,
    'microfilme': String,
    'nro_rv': String,
    'data_rv': String,
    'status_credito': {
        'code': String,
        'name': String
    },
    'vl_bruto': Number,
    'vl_desconto': Number,
    'vl_gorjeta': Number,
    'vl_liquido': Number,
    'taxa_administracao': Number,
    'nro_pv': String,
    'nro_parcela': String,
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
