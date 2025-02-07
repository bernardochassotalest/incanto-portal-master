import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_arquivo': String,
    'registro': String,
    'nro_linha': String,
    'estabelecimento': String,
    'nro_unico_ro_original': String,
    'nro_ro_antecipado': String,
    'dt_pagto_ro_antecipado': String,
    'sinal_ro_antecipado': String,
    'vl_ro_antecipado': Number,
    'nro_unico_ro_ajuste': String,
    'nro_ro_ajuste': String,
    'dt_pagto_ajuste': String,
    'sinal_ajuste_debito': String,
    'vl_ajuste_debito': Number,
    'sinal_compensado': String,
    'vl_compensado': Number,
    'sinal_saldo_ro_antecipado': String,
    'vl_saldo_ro_antecipado': Number,
    'uso_cielo': String,
    'cielo_key_group': String,
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