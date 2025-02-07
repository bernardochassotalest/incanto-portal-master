// Mapeadores para conversão de códigos da Cielo v15.9

const mapTipoLancamento = (codigo) => {
  const tipos = {
    'C': 'CREDITO',
    'D': 'DEBITO',
    'CC': 'CANCELAMENTO_CREDITO',
    'CD': 'CANCELAMENTO_DEBITO'
  };
  return tipos[codigo] || codigo;
};

const mapBandeira = (codigo) => {
  const bandeiras = {
    '001': 'VISA',
    '002': 'MASTERCARD',
    '003': 'AMEX',
    '004': 'DINERS',
    '005': 'ELO',
    '006': 'HIPERCARD'
  };
  return bandeiras[codigo] || codigo;
};

const mapFormaPagamento = (codigo) => {
  const formas = {
    '1': 'A_VISTA',
    '2': 'PARCELADO_LOJA',
    '3': 'PARCELADO_ADM'
  };
  return formas[codigo] || codigo;
};

const mapMotivoRejeicao = (codigo) => {
  const motivos = {
    '01': 'CARTAO_INVALIDO',
    '02': 'CARTAO_VENCIDO',
    '03': 'LIMITE_EXCEDIDO',
    '04': 'TRANSACAO_NAO_PERMITIDA',
    '05': 'SUSPEITA_FRAUDE'
  };
  return motivos[codigo] || codigo;
};

module.exports = {
  mapTipoLancamento,
  mapBandeira,
  mapFormaPagamento,
  mapMotivoRejeicao
};
