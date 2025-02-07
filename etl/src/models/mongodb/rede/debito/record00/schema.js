import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': Number,
    'nro_grupo': String,
    'dt_emissao': String,
    'dt_movimento': String,
    'info_01': String,
    'info_02': String,
    'nome_comercial': String,
    'nro_sequencial': String,
    'tipo_processamento': String,
    'versao_arquivo': String,
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