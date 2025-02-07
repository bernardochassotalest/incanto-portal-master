import _ from 'lodash'


const getTables = () => {
    const result = {};

    result['posicao_saldo'] = [
        { 'code': 'F', 'name': 'FINAL' },
        { 'code': 'P', 'name': 'PARCIAL' },
        { 'code': 'I', 'name': 'INTRA-DIA' },
    ];

    result['moeda'] = [
        { 'code': 'BTN', 'name': 'BÔNUS DO TESOURO NACIONAL + TR' },
        { 'code': 'BRL', 'name': 'REAL' },
        { 'code': 'USD', 'name': 'DÓLAR AMERICANO' },
        { 'code': 'PTE', 'name': 'ESCUDO PORTUGUÊS' },
        { 'code': 'FRF', 'name': 'FRANCO FRANCÊS' },
        { 'code': 'CHF', 'name': 'FRANCO SUÍÇO' },
        { 'code': 'JPY', 'name': 'IEN JAPONÊS' },
        { 'code': 'IGP', 'name': 'ÍNDICE GERAL DE PREÇOS' },
        { 'code': 'IGM', 'name': 'ÍNDICE GERAL DE PREÇOS DE MERCADO' },
        { 'code': 'GBP', 'name': 'LIBRA ESTERLINA' },
        { 'code': 'ITL', 'name': 'LIRA ITALIANA' },
        { 'code': 'DEM', 'name': 'MARCO ALEMÃO' },
        { 'code': 'TRD', 'name': 'TAXA REFERENCIAL DIÁRIA' },
        { 'code': 'UPC', 'name': 'UNIDADE PADRÃO DE CAPITAL' },
        { 'code': 'UPF', 'name': 'UNIDADE PADRÃO DE FINANCIAMENTO' },
        { 'code': 'UFR', 'name': 'UNIDADE FISCAL DE REFERÊNCIA' },
        { 'code': 'XEU', 'name': 'UNIDADE MONETÁRIA EUROPÉIA' },
    ];

    result['natureza_lancamento'] = [
        { 'code': 'DPV', 'name': 'TIPO DISPONÍVEL' },
        { 'code': 'SCR', 'name': 'TIPO VINCULADO' },
        { 'code': 'SSR', 'name': 'TIPO BLOQUEADO' },
        { 'code': 'CDS', 'name': 'COMPOSIÇÃO DE DIVERSOS SALDOS' },
    ];

    result['tipo_complemento'] = [
        { 'code': '00', 'name': 'SEM INFORMAÇÃO DO COMPLEMENTO DO LANÇAMENTO' },
        { 'code': '01', 'name': 'IDENTIFICAÇÃO DA ORIGEM DO LANÇAMENTO' },
    ];

    result['isento_cpmf'] = [
        { 'code': 'S', 'name': 'ISENTO' },
        { 'code': 'N', 'name': 'NÃO ISENTO' },
        { 'code': 'B', 'name': 'BONIFICADO' },
    ];

    result['ident_lancamento'] = [
        { 'code': '0', 'name': 'Real' },
        { 'code': '1', 'name': 'Simulado' },
    ];

    result['categoria_lancamento'] = [
        { 'code': '101', 'name': 'CHEQUES' },
        { 'code': '102', 'name': 'ENCARGOS' },
        { 'code': '103', 'name': 'ESTORNOS' },
        { 'code': '104', 'name': 'LANÇAMENTO AVISADO' },
        { 'code': '105', 'name': 'TARIFAS' },
        { 'code': '106', 'name': 'APLICAÇÃO' },
        { 'code': '107', 'name': 'EMPRÉSTIMO / FINANCIAMENTO' },
        { 'code': '108', 'name': 'CÂMBIO' },
        { 'code': '109', 'name': 'CPMF' },
        { 'code': '110', 'name': 'IOF' },
        { 'code': '111', 'name': 'IMPOSTO DE RENDA' },
        { 'code': '112', 'name': 'PAGAMENTO FORNECEDORES' },
        { 'code': '113', 'name': 'PAGAMENTOS SALÁRIO' },
        { 'code': '114', 'name': 'SAQUE ELETRÔNICO' },
        { 'code': '115', 'name': 'AÇÕES' },
        { 'code': '117', 'name': 'TRANSFERÊNCIA ENTRE CONTAS' },
        { 'code': '118', 'name': 'DEVOLUÇÃO DA COMPENSAÇÃO' },
        { 'code': '119', 'name': 'DEVOLUÇÃO DE CHEQUE DEPOSITADO' },
        { 'code': '120', 'name': 'TRANSFERÊNCIA INTERBANCÁRIA (DOC, TED)' },
        { 'code': '121', 'name': 'ANTECIPAÇÃO A FORNECEDORES' },
        { 'code': '122', 'name': 'OC / AEROPS' },
        { 'code': '201', 'name': 'DEPÓSITOS' },
        { 'code': '202', 'name': 'LÍQUIDO DE COBRANÇA' },
        { 'code': '203', 'name': 'DEVOLUÇÃO DE CHEQUES' },
        { 'code': '204', 'name': 'ESTORNOS' },
        { 'code': '205', 'name': 'LANÇAMENTO AVISADO' },
        { 'code': '206', 'name': 'RESGATE DE APLICAÇÃO' },
        { 'code': '207', 'name': 'EMPRÉSTIMO / FINANCIAMENTO' },
        { 'code': '208', 'name': 'CÂMBIO' },
        { 'code': '209', 'name': 'TRANSFERÊNCIA INTERBANCÁRIA (DOC, TED)' },
        { 'code': '210', 'name': 'AÇÕES' },
        { 'code': '211', 'name': 'DIVIDENDOS' },
        { 'code': '212', 'name': 'SEGURO' },
        { 'code': '213', 'name': 'TRANSFERÊNCIA ENTRE CONTAS' },
        { 'code': '214', 'name': 'DEPÓSITOS ESPECIAIS' },
        { 'code': '215', 'name': 'DEVOLUÇÃO DA COMPENSAÇÃO' },
        { 'code': '216', 'name': 'OCT' },
        { 'code': '217', 'name': 'PAGAMENTOS FORNECEDORES' },
        { 'code': '218', 'name': 'PAGAMENTOS DIVERSOS' },
        { 'code': '219', 'name': 'PAGAMENTOS SALÁRIOS' },
    ];

    result['tipo_inscricao'] = [
        { 'code': '0', 'name': 'ISENTO / NÃO INFORMADO' },
        { 'code': '1', 'name': 'CPF' },
        { 'code': '2', 'name': 'CNPJ' },
        { 'code': '3', 'name': 'PIS/PASEP' },
        { 'code': '9', 'name': 'OUTROS' },
    ];

    return result;
}

export const getIdTable = (property, value) => {
    const Tables = getTables();
    let findValue = _.find(Tables[property], { 'code': value });

    if (!findValue) {
        findValue = { 'code': value, 'name': value };
    }

    return findValue;
}
