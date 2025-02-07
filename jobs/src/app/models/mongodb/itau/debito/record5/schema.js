import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'nro_linha': String,
    'banco': String,
    'lote': String,
    'registro': String,
    'qt_registros_lote': Number,
    'somatorio_debito': Number,
    'somatorio_moedas': Number,
    'ocorrencias': String,
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
