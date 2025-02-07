import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': Number,
    'nro_matriz': String,
    'qtd_resumos': Number,
    'qtd_cv': Number,
    'vl_bruto': Number,
    'vl_desconto': Number,
    'vl_liquido': Number,
    'vl_bruto_pre': Number,
    'vl_desconto_pre': Number,
    'vl_liquido_pre': Number,
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