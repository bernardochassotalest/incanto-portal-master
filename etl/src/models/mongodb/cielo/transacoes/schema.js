const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  tipo_registro: {
    type: String,
    required: true,
    enum: ['D']
  },
  numero_pv: {
    type: String,
    required: true,
    index: true
  },
  numero_documento: {
    type: String,
    required: true
  },
  data_lancamento: {
    type: Date,
    required: true,
    index: true
  },
  data_movimento: {
    type: Date,
    required: true,
    index: true
  },
  tipo_lancamento: {
    type: String,
    required: true,
    enum: ['CREDITO', 'DEBITO', 'CANCELAMENTO_CREDITO', 'CANCELAMENTO_DEBITO']
  },
  valor_lancamento: {
    type: Number,
    required: true
  },
  bandeira: {
    type: String,
    required: true
  },
  forma_pagamento: {
    type: String,
    required: true,
    enum: ['A_VISTA', 'PARCELADO_LOJA', 'PARCELADO_ADM']
  },
  numero_parcela: {
    type: Number,
    required: true
  },
  total_parcelas: {
    type: Number,
    required: true
  },
  numero_cartao: String,
  codigo_autorizacao: String,
  nsu: {
    type: String,
    required: true,
    index: true
  },
  valor_bruto: Number,
  valor_taxa: Number,
  valor_liquido: Number,
  status_processamento: {
    type: String,
    required: true
  },
  motivo_rejeicao: String,
  chave_ur: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compostos
schema.index({ numero_pv: 1, data_lancamento: 1 });
schema.index({ numero_pv: 1, nsu: 1 });

module.exports = schema;
