const parseRecordE = (line) => {
  try {
    // Validação básica
    if (!line || line.length < 400) {
      throw new Error('Linha inválida para registro E');
    }

    // Extração dos campos conforme layout 15.9
    const record = {
      tipo_registro: line.substring(0, 1),
      numero_pv: line.substring(1, 10).trim(),
      nsu: line.substring(10, 22).trim(),
      data_lancamento: line.substring(22, 30),
      valor_total: parseInt(line.substring(30, 45)) / 100,
      valor_parcela: parseInt(line.substring(45, 60)) / 100,
      pagamento_parcial: line.substring(60, 61) === 'S',
      data_prevista_pagamento: line.substring(61, 69),
      banco: line.substring(69, 72).trim(),
      agencia: line.substring(72, 77).trim(),
      conta: line.substring(77, 87).trim(),
      status_pagamento: line.substring(87, 88),
      motivo_rejeicao_pagamento: line.substring(88, 90),
      chave_ur: `${line.substring(1, 10)}_${line.substring(10, 22)}_${line.substring(22, 30)}` // PV_NSU_DATA
    };

    // Validações de negócio
    if (record.valor_total <= 0) {
      throw new Error('Valor total inválido');
    }

    if (record.valor_parcela <= 0) {
      throw new Error('Valor da parcela inválido');
    }

    if (!['0', '1', '2'].includes(record.status_pagamento)) {
      throw new Error('Status de pagamento inválido');
    }

    return record;
  } catch (error) {
    console.error(`Erro ao processar registro E: ${error.message}`);
    throw error;
  }
};

module.exports = parseRecordE;
