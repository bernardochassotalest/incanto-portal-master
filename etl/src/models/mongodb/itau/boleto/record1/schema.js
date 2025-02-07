import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    '_keyCommon': String,
    'nro_linha': String,
    'registro': String,
    'tipo_inscricao': {
        'code': String,
        'name': String
    },
    'nro_inscricao': String,
    'agencia': String,
    'conta_corrente': String,
    'dig_conta_corrente': String,
    'nro_titulo': String,
    'nro_tit_banco': String,
    'nro_carteira': String,
    'nosso_numero': String,
    'dig_nosso_numero': String,
    'cod_carteira': String,
    'ocorrencia': {
        'code': String,
        'name': String
    },
    'dt_ocorrencia': String,
    'nro_documento': String,
    'conf_nosso_nro': String,
    'dt_vencimento': String,
    'vl_titulo': Number,
    'banco_cobrador': String,
    'ag_cobradora': String,
    'dac_ag_cobradora': String,
    'especie_titulo': {
        'code': String,
        'name': String
    },
    'vl_tarifa': Number,
    'vl_iof': Number,
    'vl_abatimento': Number,
    'vl_desconto': Number,
    'vl_pago': Number,
    'vl_juros': Number,
    'vl_outros_creditos': Number,
    'ind_dda': {
        'code': String,
        'name': String
    },
    'dt_credito': String,
    'instrucao_cancelada': String,
    'nome_pagador': String,
    'erros': String,
    'tipo_liquidacao': {
        'code': String,
        'name': String,
        'resource': String
    },
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