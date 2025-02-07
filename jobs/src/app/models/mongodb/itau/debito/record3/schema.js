import {Schema} from 'mongoose'

const keysSchema = new Schema({
    'Bank': String,
    'Branch': String,
    'Account': String,
    'DigitAcct': String,
    'DebitNumber': String,
    'OurNumber': String,
    'Settlement': String
}, { '_id': false })

const schema = new Schema({
    '_id': String,
    '_keys': keysSchema,
    'nro_linha': String,
    'banco': String,
    'lote': String,
    'registro': String,
    'nr_sequencial': String,
    'tag': String,
    'cod_segmento': String,
    'cod_instrucao': {
        'code': String,
        'name': String
    },
    'compensacao': String,
    'banco_debitado': String,
    'agencia_debitada': String,
    'conta_debitada': String,
    'dig_conta_debitada': String,
    'nome_debitado': String,
    'nro_documento': String,
    'data_arquivo': String,
    'data_agendada': String,
    'tipo_moeda': {
        'code': String,
        'name': String
    },
    'qtd_moeda': Number,
    'valor_agendado': Number,
    'nosso_numero': String,
    'data_cobrada': String,
    'valor_cobrado': Number,
    'tipo_mora': {
        'code': String,
        'name': String
    },
    'valor_mora': Number,
    'historico': String,
    'nro_inscricao': String,
    'ocorrencia1': {
        'code': String,
        'name': String
    },
    'ocorrencia2': {
        'code': String,
        'name': String
    },
    'ocorrencia3': {
        'code': String,
        'name': String
    },
    'ocorrencia4': {
        'code': String,
        'name': String
    },
    'ocorrencia5': {
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
