import _ from 'lodash';

const mapBase = {
    transId: 'LCM',
    group: 'Operação',
    tag: 'Agrupamento',
    billId: 'Fatura',
    vatNumber: 'CPF/CNPJ',
    customerName: 'Nome',
    refDate: 'Dt Lançamento',
    taxDate: 'Dt Documento',
    dueDate: 'Dt Vencimento',
    amount: 'Valor ',
    crdAcctCode: 'Conta Crédito',
    crdAcctName: 'Nome Conta Crédito',
    crdCardCode: 'PN Crédito',
    crdCardName: 'Nome PN Crédito',
    debAcctCode: 'Conta Débito',
    debAcctName: 'Nome Conta Débito',
    debCardCode: 'PN Débito',
    debCardName: 'Nome PN Débito',
    memo: 'Observação',
  },
  saldosBase = {
    id: 'Nr Venda',
    tag: 'Agrupamento',
    sourceId: 'Fatura',
    refDate: 'Dt Documento',
    status: 'Status Vindi',
    vatNumber: 'CPF/CNPJ',
    customerName: 'Nome',
    amount: 'Valor'
  },
  mapExport = {
    geral: { ...mapBase },
    receitas: {
      ...mapBase,
      itemCode: 'Produto',
      itemName: 'Descrição',
      ownerName: 'Associado',
    },
    saldosCartoes: {
      ...saldosBase
    },
    saldosBoletos: {
      ...saldosBase
    },
    saldosDebito: {
      ...saldosBase
    },
    saldosNaoCaptura: {
      ...saldosBase
    },
    saldosPECLD: {
      ...saldosBase
    },
    boletos: {
      ...mapBase,
      bank: 'Banco',
      branch: 'Agência',
      account: 'Conta',
      ourNumber: 'Nosso Número',
      digitOurNumber: 'Digito',
      reference: 'Nro Referência',
      holderName: 'Sacado',
      type: 'Tipo Lançamento',
      occurId: 'Ocorrência',
      occurName: 'Descrição',
      paidPlace: 'Meio de Pagamento',
    },
    cartoesCaptura: {
      ...mapBase,
      acquirer: 'Adquirente',
      pointOfSale: 'Ponto de Venda',
      batchNo: 'Resumo de Venda',
      saleType: 'Tipo Venda',
      captureTime: 'Hora da Captura',
      nsu: 'NSU',
      authorization: 'Autorização',
      tid: 'TID',
      reference: 'Nro Referência',
      cardBrandName: 'Bandeira',
      captureType: 'Tipo de Captura',
      installment: 'Parcela',
    },
    cartoesLiquidacao: {
      transId: 'LCM',
      group: 'Operação',
      tag: 'Agrupamento',
      refDate: 'Dt Lançamento',
      taxDate: 'Dt Documento',
      dueDate: 'Dt Vencimento',
      amount: 'Valor ',
      crdAcctCode: 'Conta Crédito',
      crdAcctName: 'Nome Conta Crédito',
      crdCardCode: 'PN Crédito',
      crdCardName: 'Nome PN Crédito',
      debAcctCode: 'Conta Débito',
      debAcctName: 'Nome Conta Débito',
      debCardCode: 'PN Débito',
      debCardName: 'Nome PN Débito',
      memo: 'Observação',
      acquirer: 'Adquirente',
      pointOfSale: 'Ponto de Venda',
      batchNo: 'Resumo de Venda',
      operationNo: 'Nr Operação',
      plan: 'Tipo Resumo',
      cardBrandName: 'Bandeira',
      installment: 'Parcela',
      bankCode: 'Banco',
      bankBranch: 'Agência',
      bankAccount: 'Conta Corrente',
      notes: 'Observações',
    },
    historicoFatura: {
      tag: 'Agrupamento',
      billId: 'Fatura',
      taxDate: 'Dt Documento',
      status: 'Status Vindi',
      vatNumber: 'CPF/CNPJ',
      customerName: 'Nome',
      model: 'Modelo Contábil',
      transId: 'Nr LCM',
      refDate: 'Dt Lançamento',
      dueDate: 'Dt Vencimento',
      group: 'Grupo Contábil',
      amount: 'Valor ',
      crdAcctCode: 'Conta Crédito',
      crdAcctName: 'Nome Conta Crédito',
      crdCardCode: 'PN Crédito',
      crdCardName: 'Nome PN Crédito',
      debAcctCode: 'Conta Débito',
      debAcctName: 'Nome Conta Débito',
      debCardCode: 'PN Débito',
      debCardName: 'Nome PN Débito',
      memo: 'Observação',
    },
    saldosFatura: {
      tag: 'Agrupamento',
      billId: 'Fatura',
      status: 'Status',
      taxDate: 'Dt Documento',
      vatNumber: 'CPF/CNPJ',
      customerName: 'Nome',
      invoiced_rct_provisao: 'Receita: Provisão',
      invoiced_adq_captura: 'Cartão: Captura',
      invoiced_bnc_bol_captura: 'Boleto: Captura',
      invoiced_bnc_bol_cancelamento: 'Boleto: Cancelamento',
      invoiced_lmb_provisao: 'Não Capturado',
      invoiced_crd_captura: 'Crédito: Captura',
      invoiced_saldo: 'Saldo de Captura',
      empty: '-----',
      notCaptured_lmb_provisao: 'Não Capturado: Provisão',
      notCaptured_lmb_to_boleto: 'Não Capturado: Transf p/Boleto',
      notCaptured_lmb_to_cartao: 'Não Capturado: Transf p/Cartão',
      notCaptured_lmb_cancelamento: 'Não Capturado: Cancelamento',
      notCaptured_saldo: 'Não Capturado: Saldo',
    },
    concBoletos: {
      bank: 'Banco',
      branch: 'Agência',
      account: 'Conta Corrente',
      digitAccount: 'Digito',
      tag: 'Agrupamento',
      ourNumber: 'Nosso Número',
      digitOurNumber: 'Dig Nosso Nro',
      refDate: 'Dt Emissão',
      dueDate: 'Dt Vencimento',
      amount: 'Valor',
      holderName: 'Sacado',
      occurDate: 'Dt Ocorrência',
      occurId: 'Ocorrência',
      occurName: 'Descrição',
      keyNotes: 'Justificativa',
      userName: 'Usuário',
      keyCommon: 'Chave Conciliação',
      concId: 'Id Interno',
    },
    concCartaoCaptura: {
      acquirer: 'Adquirente',
      tag: 'Agrupamento',
      pointOfSale: 'Ponto de Venda',
      batchNo: 'Resumo de Venda',
      saleType: 'Tipo Venda',
      captureDate: 'Dt Captura',
      captureTime: 'Hr Captura',
      grossAmount: 'Vl Bruto',
      rate: 'Taxa(MDR)',
      commission: 'Vl Comissão',
      netAmount: 'Vl Liquido',
      nsu: 'NSU',
      authorization: 'Autorização',
      tid: 'TID',
      reference: 'Nro Referência',
      cardNumber: 'Nro Cartão',
      cardBrandName: 'Bandeira',
      captureType: 'Tipo Captura',
      terminalNo: 'Nr Terminal',
      keyNotes: 'Justificativa',
      userName: 'Usuário',
      keyCommon: 'Chave Conciliação',
      concId: 'Id Interno',
    },
    concCartaoLiquidacao: {
      acquirer: 'Adquirente',
      tag: 'Agrupamento',
      pointOfSale: 'Ponto de Venda',
      type: 'Tipo Lançamento',
      plan: 'Plano',
      refDate: 'Dt Lançamento',
      batchNo: 'Resumo de Venda',
      operationNo: 'Nro Operação',
      settlement: 'Vl Pago',
      installment: 'Nro Parcela',
      cardBrandName: 'Bandeira',
      bankCode: 'Banco',
      bankBranch: 'Agência',
      bankAccount: 'Conta Corrente',
      notes: 'Observações',
      keyNotes: 'Justificativa',
      userName: 'Usuário',
      keyCommon: 'Chave Conciliação',
      concId: 'Id Interno',
    },
    concExtratoBancario: {
      bank: 'Banco',
      branch: 'Agência',
      account: 'Conta Corrente',
      digitAccount: 'Digito',
      conciliationType: 'Tipo Conciliação',
      date: 'Data',
      debit: 'Vl Débito',
      credit: 'Vl Crédito',
      acquirer: 'Adquirente',
      pointOfSale: 'Ponto de Venda',
      cashFlow: 'Tipo Lançamento',
      notes: 'Histórico',
      keyNotes: 'Justificativa',
      userName: 'Usuário',
      keyCommon: 'Chave Conciliação',
      concId: 'Id Interno',
    },
    concConcVindi: {
      billId: 'Nro Fatura',
      vatNumber: 'CPF/CNPJ',
      name: 'Nome',
      id: 'Nr Transação',
      date: 'Dt Transação',
      amount: 'Vl Transação',
      transactionType: 'Tipo',
      status: 'Status',
      paymentMethod: 'Meio Pagamento',
      nsu: 'NSU',
      authorization: 'Autorização',
      tid: 'TID',
      keyNotes: 'Justificativa',
      userName: 'Usuário',
      keyCommon: 'Chave Conciliação',
      concId: 'Id Interno',
    },
    concConcMulticlubes: {
      paymentId: 'Nro Pagamento',
      titleNumber: 'Nro Título',
      memberVatNumber: 'CPF',
      memberName: 'Nome',
      mode: 'Meio Pagamento',
      paidDate: 'Dt Pagamento',
      paidAmount: 'Vl Pago',
      tefDate: 'Dt Captura',
      tefTime: 'Hr Captura',
      tefNsu: 'NSU',
      tefAuthNumber: 'Autorização',
      tefTid: 'TID',
      tefCardNumber: 'Nro Cartão',
      tefParcelType: 'Tipo Parcelamento',
      keyNotes: 'Justificativa',
      userName: 'Usuário',
      keyCommon: 'Chave Conciliação',
      concId: 'Id Interno',
    },
    creditosClientes: {
      billId: 'Nr Fatura',
      chargeId: 'Nr Cobrança',
      status: 'Status Fatura',
      taxDate: 'Dt Crédito',
      vindiId: 'Id Vindi',
      vatNumber: 'CPF/CNPJ',
      name: 'Associado',
      email: 'E-Mail',
      phone: 'Telefone',
      amount: 'Valor',
      balance: 'Saldo'
    },
  };

export const getExportMap = (type) => {
  let fieldExportMap = mapExport[type];
  if (_.isEmpty(fieldExportMap) == true) {
    fieldExportMap = mapExport['geral'];
  }

  return fieldExportMap;
}
