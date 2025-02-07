import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'nro_linha': String,
    'registro': String,
    'cod_retorno': String,
    'tipo_servico': String,
    'cod_banco': String,
    'qt_cobr_simples': Number,
    'vl_cobr_simples': Number,
    'aviso_bancario1': String,
    'qt_cobr_vinculada': Number,
    'vl_cobr_vinculada': Number,
    'aviso_bancario2': String,
    'qt_cobr_escritural': Number,
    'vl_cobr_escritural': Number,
    'aviso_bancario3': String,
    'nro_arquivo': String,
    'qt_titulos': Number,
    'vl_titulos': Number,
    'nro_sequencial': String,
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