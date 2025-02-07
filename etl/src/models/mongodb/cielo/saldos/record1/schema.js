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
    'nro_ro': String,
    'nro_resumo': String,
    'parcela': String,
    'filler': {
        'code': String,
        'name': String
    },
    'plano': String,
    'tipo_transacao': {
        'code': String,
        'name': String
    },
    'dt_apresentacao': String,
    'dt_pagamento': String,
    'dt_envio_banco': String,
    'dt_lancamento': String,
    'sinal_bruto': String,
    'vl_bruto': Number,
    'sinal_comissao': String,
    'vl_comissao': Number,
    'sinal_rejeitado': String,
    'vl_rejeitado': Number,
    'sinal_liquido': String,
    'vl_liquido': Number,
    'banco': String,
    'agencia': String,
    'conta_corrente': String,
    'status_pagamento': {
        'code': String,
        'name': String
    },
    'qt_cvs_aceitos': Number,
    'cod_produto_antigo': String,
    'qt_cvs_rejeitados': Number,
    'ind_revenda': {
        'code': String,
        'name': String
    },
    'dt_captura': String,
    'origem_ajuste': {
        'code': String,
        'name': String,
        'group': String,
        'kind': String
    },
    'vl_complementar': Number,
    'ind_antecipacao': {
        'code': String,
        'name': String
    },
    'nro_antecipacao': String,
    'sinal_antecipado': String,
    'vl_antecipado': Number,
    'bandeira': {
        'code': String,
        'name': String
    },
    'nro_unico_ro': String,
    'taxa_comissao': Number,
    'tarifa': Number,
    'taxa_garantia': Number,
    'meio_captura': {
        'code': String,
        'name': String
    },
    'nro_terminal': String,
    'cod_produto': {
        'code': String,
        'name': String,
        'kind': String
    },
    'matriz_pagamento': String,
    'reenvio_pagamento': String,
    'conceito_aplicado': String,
    'uso_cielo': String,
    'status_lancamento': String,
    'modelo_lancamento': String,
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