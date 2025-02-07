import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_resumo_venda': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_parcela': String,
    'tipo_plano': String,
    'tag': String,
    'nro_pv': String,
    'nro_rv': String,
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'data': String,
    'qt_cv_nsu': Number,
    'vl_bruto': Number,
    'vl_gorjeta': Number,
    'vl_rejeitado': Number,
    'taxa_comissao': Number,
    'vl_desconto': Number,
    'vl_liquido': Number,
    'dt_credito': String,
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