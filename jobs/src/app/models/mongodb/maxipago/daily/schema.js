import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'nro_linha': String,
    'MERCHANT_ID': String,
    'TRANSACTION_ID': String,
    'ORDER_ID': String,
    'TRANSACTION_TIMESTAMP': String,
    'TRANSACTION_DATE': String,
    'CAPTURED_DATE': String,
    'TYPE': String,
    'TRANSACTION_AMOUNT': Number,
    'INSTALLMENTS': String,
    'GATEWAY_ID': String,
    'CC_BRAND': String,
    'CC_FIRST_LAST_FOUR': String,
    'AUTHORIZATION_CODE': String,
    'NSU': String,
    'GATEWAY_TRANSACTION_ID': String,
    'CURRENCY_CODE': String,
    'REFERENCE_NUMBER': String,
    'GATEWAY_CODE': String,
    'GATEWAY_MESSAGE': String,
    'STATE': String,
    'RECURRING_PAYMENT': String,
    'COMPANY_NAME': String,
    'Championship': {
        'Code': String,
        'Name': String
    },
    'Match': {
        'Code': String,
        'Name': String
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