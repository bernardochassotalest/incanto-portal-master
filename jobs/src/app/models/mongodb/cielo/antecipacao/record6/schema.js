import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_resumo_venda': String,
    'tipo_arquivo': String,
    'registro': String,
    'nro_linha': String,
    'nro_parcela': String,
    'tipo_plano': String,
    'tag': String,
    'estabelecimento': String,
    'nro_resumo': String,
    'nro_operacao': String,
    'dt_vencimento_ro': String,
    'nro_ro_antecipado': String,
    'parcela_antecipada': String,
    'total_parcelas': String,
    'sinal_bruto_original': String,
    'vl_bruto_original': Number,
    'sinal_liquido_original': String,
    'vl_liquido_original': Number,
    'sinal_bruto_antecipacao': String,
    'vl_bruto_antecipacao': Number,
    'sinal_liquido_antecipacao': String,
    'vl_liquido_antecipacao': Number,
    'bandeira': {
        'code': String,
        'name': String
    },
    'nro_unico_ro': String,
    'identificador_ro': String,
    'uso_cielo': String,
    'dt_credito': String,
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'taxa_comissao': Number,
    'taxa_antecipacao': Number,
    'status_lancamento': String,
    'tipo_lancamento': String,
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

schema.index({ '_resumo_venda': 1 })

export default schema