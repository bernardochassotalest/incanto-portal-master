import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'nro_linha': String,
    'banco': String,
    'lote': String,
    'registro': String,
    'tipo_inscricao': String,
    'nro_inscricao': String,
    'cod_empresa': String,
    'agencia': String,
    'dig_agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'data_saldo': String,
    'valor_final': Number,
    'valor_saldo': Number,
    'situacao_saldo': String,
    'posicao_saldo': String,
    'qt_registros_lote': Number,
    'somatorio_debito': Number,
    'somatorio_credito': Number,
    'somatorio_futuro': Number,
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