import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': Number,
    'nro_matriz': String,
    'qtd_resumos': Number,
    'qtd_cvs': Number,
    'vl_total_bruto': Number,
    'vl_total_desconto': Number,
    'vl_total_liquido': Number,
    'vl_bruto_pre_datado': Number,
    'vl_desconto_pre_datado': Number,
    'vl_liquido_pre_datado': Number,
    'qtd_total_arquivo': Number,
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