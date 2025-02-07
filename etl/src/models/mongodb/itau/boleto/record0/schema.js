import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'nro_linha': String,
    'registro': String,
    'cod_retorno': String,
    'tipo_movimento': String,
    'cod_servico': String,
    'tipo_servico': String,
    'agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'nome_empresa': String,
    'cod_banco': String,
    'nome_banco': String,
    'data_geracao': String,
    'densidade1': String,
    'densidade2': String,
    'nro_arquivo': String,
    'data_credito': String,
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