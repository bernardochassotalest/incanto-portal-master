const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  tipo_registro: {
    type: String,
    required: true,
    enum: ['E']
  },
  numero_pv: {
    type: String,
    required: true,
    index: true
  },
  nsu: {
    type: String,
    required: true,
    index: true
  },
  data_lancamento: {
    type: Date,
    required: true,
    index: true
  },
  valor_total: {
    type: Number,
    required: true
  },
  valor_parcela: {
    type: Number,
    required: true
  },
  pagamento_parcial: {
    type: Boolean,
    default: false
  },
  data_prevista_pagamento: {
    type: Date,
    required: true,
    index: true
  },
  banco: {
    type: String,
    required: true
  },
  agencia: {
    type: String,
    required: true
  },
  conta: {
    type: String,
    required: true
  },
  status_pagamento: {
    type: String,
    required: true,
    enum: ['0', '1', '2']
  },
  motivo_rejeicao_pagamento: String,
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
schema.index({ data_prevista_pagamento: 1, status_pagamento: 1 });

module.exports = schema;
