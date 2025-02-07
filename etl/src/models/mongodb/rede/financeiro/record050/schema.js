import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_key': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'nro_pv_matriz': String,
    'qtd_resumos': Number,
    'vl_creditos_normais': Number,
    'qtd_creditos_antecipados': Number,
    'vl_antecipado': Number,
    'qtd_ajustes_credito': Number,
    'vl_ajustes_credito': Number,
    'qtd_ajutes_debito': Number,
    'vl_ajustes_debito': Number,
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