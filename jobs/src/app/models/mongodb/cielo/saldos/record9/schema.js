import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_arquivo': String,
    'registro': String,
    'nro_linha': String,
    'total_registro': Number,
    'sinal_liquido': String,
    'vl_liquido': Number,
    'qt_transacoes': Number,
    'uso_cielo': String,
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

export default schema