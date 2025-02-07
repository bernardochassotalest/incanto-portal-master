const { 
  mapTipoLancamento, 
  mapBandeira, 
  mapFormaPagamento, 
  mapMotivoRejeicao 
} = require('./mappers');

const parseRecordD = (line) => {
  try {
    // Validação básica
    if (!line || line.length < 400) {
      throw new Error('Linha inválida para registro D');
    }

    // Extração dos campos conforme layout 15.9
    const record = {
      tipo_registro: line.substring(0, 1),
      numero_pv: line.substring(1, 10).trim(),
      numero_documento: line.substring(10, 25).trim(),
      data_lancamento: line.substring(25, 33),
      data_movimento: line.substring(33, 41),
      tipo_lancamento: mapTipoLancamento(line.substring(41, 43)),
      valor_lancamento: parseInt(line.substring(43, 58)) / 100, // Convertendo para decimal
      bandeira: mapBandeira(line.substring(58, 61)),
      forma_pagamento: mapFormaPagamento(line.substring(61, 62)),
      numero_parcela: parseInt(line.substring(62, 64)),
      total_parcelas: parseInt(line.substring(64, 66)),
      numero_cartao: line.substring(66, 82).trim(),
      codigo_autorizacao: line.substring(82, 88).trim(),
      nsu: line.substring(88, 100).trim(),
      valor_bruto: parseInt(line.substring(100, 115)) / 100,
      valor_taxa: parseInt(line.substring(115, 130)) / 100,
      valor_liquido: parseInt(line.substring(130, 145)) / 100,
      status_processamento: line.substring(145, 146),
      motivo_rejeicao: mapMotivoRejeicao(line.substring(146, 148)),
      chave_ur: `${line.substring(1, 10)}_${line.substring(88, 100)}_${line.substring(25, 33)}` // PV_NSU_DATA
    };

    // Validações de negócio
    if (record.valor_lancamento <= 0) {
      throw new Error('Valor do lançamento inválido');
    }

    if (!['C', 'D', 'CC', 'CD'].includes(record.tipo_lancamento)) {
      throw new Error('Tipo de lançamento inválido');
    }

    return record;
  } catch (error) {
    console.error(`Erro ao processar registro D: ${error.message}`);
    throw error;
  }
};

module.exports = parseRecordD;
