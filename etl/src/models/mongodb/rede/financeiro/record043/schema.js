import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_resumo_venda': String,
    'tipo_venda': String,
    'registro': String,
    'nro_linha': String,
    'tag': String,
    'nro_pv': String,
    'nro_rv': String,
    'nro_documento': String,
    'dt_emissao': String,
    'dt_credito': String,
    'vl_credito': Number,
    'indicador': String,
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'motivo_credito_cod': String,
    'motivo_credito_desc': String,
    'bandeira': {
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

schema.index({ '_resumo_venda': 1 })

export default schema