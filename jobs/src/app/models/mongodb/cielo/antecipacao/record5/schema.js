import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'tipo_arquivo': String,
    'registro': String,
    'nro_linha': String,
    'estabelecimento': String,
    'nro_operacao': String,
    'dt_credito': String,
    'sinal_bruto_a_vista': String,
    'vl_bruto_a_vista': Number,
    'sinal_bruto_parcelado': String,
    'vl_bruto_parcelado': Number,
    'sinal_bruto_pre_datado': String,
    'vl_bruto_pre_datado': Number,
    'sinal_bruto_antecipacao': String,
    'vl_bruto_antecipacao': Number,
    'sinal_liquido_a_vista': String,
    'vl_liquido_a_vista': Number,
    'sinal_liquido_parcelado': String,
    'vl_liquido_parcelado': Number,
    'sinal_liquido_pre_datado': String,
    'vl_liquido_pre_datado': Number,
    'sinal_liquido_antecipacao': String,
    'vl_liquido_antecipacao': Number,
    'taxa_desconto_antecipacao': String,
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'sinal_liquido_antecipacao_total': String,
    'vl_liquido_antecipacao_total': Number,
    'sinal_tarifa': String,
    'vl_tarifa': Number,
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