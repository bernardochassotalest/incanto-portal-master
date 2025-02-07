import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'qtd_matrizes': Number,
    'qtd_registros': Number,
    'nro_pv_grupo': String,
    'vl_total_bruto': Number,
    'qtd_cv_rejeitados': Number,
    'vl_rejeitado': Number,
    'vl_rotativo': Number,
    'vl_parcelado': Number,
    'vl_iata': Number,
    'vl_dolar': Number,
    'vl_desconto': Number,
    'vl_liquido': Number,
    'vl_gorjeta': Number,
    'vl_taxa_embarque': Number,
    'qtd_cv_acatados': Number,
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