import {Schema} from 'mongoose'

const keysSchema = new Schema({
    'Bank': String,
    'Branch': String,
    'Account': String,
    'DigitAcct': String,
    'DebitNumber': String,
    'Settlement': String
}, { '_id': false })

const schema = new Schema({
    '_id': String,
    '_keys': keysSchema,
    'nro_linha': String,
    'registro': String,
    'tag': String,
    'cod_cliente': String,
    'agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'data_lancamento': String,
    'valor_lancado': Number,
    'ocorrencia': {
        'code': String,
        'name': String
    },
    'nro_documento': String,
    'valor_mora': Number,
    'nro_inscricao': String,
    'cod_movimento': {
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
