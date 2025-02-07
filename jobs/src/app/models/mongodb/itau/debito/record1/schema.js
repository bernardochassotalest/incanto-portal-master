import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'nro_linha': String,
    'banco': String,
    'lote': String,
    'registro': String,
    'tipo_operacao': String,
    'tipo_servico': String,
    'forma_lancamento': String,
    'nro_versao': String,
    'tipo_inscricao': String,
    'nro_inscricao': String,
    'cod_empresa': String,
    'agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'nome_empresa': String,
    'endereco_empresa': String,
    'nro_empresa': String,
    'complemento_empresa': String,
    'cidade_empresa': String,
    'cep_empresa': String,
    'estado_empresa': String,
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
