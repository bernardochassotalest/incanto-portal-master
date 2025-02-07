import _ from 'lodash'
import fs from 'fs'
import { mongodb } from 'app/models'
import { md5, sizedField } from 'app/lib/utils'
import { getIdTable } from 'app/jobs/skill/finance-files/rede/common/tables'
import { setTidPedido, parserForKeys, setCommissionRate } from 'app/jobs/skill/finance-files/rede/common/utils'
import { getTransactionKeys, getTag } from 'app/jobs/skill/commons/utils'

const idsAluguel = ['06', '20', '28', '48', '49'];

const parserRecord030 = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'dt_emissao', line.substr(7, 4) + '-' + line.substr(5, 2) + '-' + line.substr(3, 2))
    _.set(result, 'info_01', _.trim(line.substr(11, 8)))
    _.set(result, 'info_02', _.trim(line.substr(19, 34)))
    _.set(result, 'nome_comercial', _.trim(line.substr(53, 22)))
    _.set(result, 'nro_sequencial', line.substr(75, 6))
    _.set(result, 'nr_pv_matriz', line.substr(81, 9))
    _.set(result, 'tipo_processamento', _.trim(line.substr(90, 15)))
    _.set(result, 'versao_arquivo', _.trim(line.substr(105, 20)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord032 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_matriz', _.trim(line.substr(3, 9)))
    _.set(result, 'nome_comercial', _.trim(line.substr(12, 22)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord034 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(131, 9),
        nro_parcela = line.substr(124, 5),
        tipo_plano = (nro_parcela === '01/01' ? 'rotativo' : 'parcelado');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tipo_plano', tipo_plano)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv_centralizador', line.substr(3, 9))
    _.set(result, 'nro_documento', line.substr(12, 11))
    _.set(result, 'dt_lancamento', line.substr(27, 4) + '-' + line.substr(25, 2) + '-' + line.substr(23, 2))
    _.set(result, 'vl_lancamento', Number(line.substr(31, 15)) / 100)
    _.set(result, 'tipo_ajuste', getIdTable(fileType, 'tipo_ajuste', line.substr(46, 1)))
    _.set(result, 'banco', line.substr(47, 3))
    _.set(result, 'agencia', line.substr(50, 6))
    _.set(result, 'conta_corrente', line.substr(56, 11))
    _.set(result, 'dt_movimento', line.substr(71, 4) + '-' + line.substr(69, 2) + '-' + line.substr(67, 2))
    _.set(result, 'nro_rv', line.substr(75, 9))
    _.set(result, 'data_rv', line.substr(88, 4) + '-' + line.substr(86, 2) + '-' + line.substr(84, 2))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(92, 1)))
    _.set(result, 'tipo_transacao', line.substr(93, 1))
    _.set(result, 'vl_bruto', Number(line.substr(94, 15)) / 100)
    _.set(result, 'vl_desconto', Number(line.substr(109, 15)) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_a_receber', 0)
    _.set(result, 'taxa_administracao', 0)
    _.set(result, 'nro_parcela', nro_parcela)
    _.set(result, 'status_credito', getIdTable(fileType, 'tipo_status', line.substr(129, 2)))
    _.set(result, 'nro_pv_original', line.substr(131, 9))
    _.set(result, 'nro_pedido', '')
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'data_rv', '') + '-' + _.get(result, 'nro_rv', ''))

    setCommissionRate(result);

    params.totals.qtd_record034_036 += 1;
    params.totals.vl_record034_036 += result.vl_lancamento;

    let vl_bruto = _.get(result, 'vl_bruto', 0),
        vl_desconto = _.get(result, 'vl_desconto', 0),
        vl_a_receber = _.round(vl_bruto - vl_desconto, 2),
        taxa_administracao = _.round(((vl_desconto/vl_bruto) * 100), 2);
    if (_.isNaN(taxa_administracao) == true) {
        taxa_administracao = 0;
    }
    result['taxa_administracao'] = taxa_administracao;
    result['vl_a_receber'] = vl_a_receber;

    return result;
}

const parserRecord035 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(137, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, '_keys', {})
    _.set(result, '_resumo_venda', '')
    _.set(result, '_resumo_original', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv_ajustado', line.substr(3, 9))
    _.set(result, 'nro_rv_ajustado', line.substr(12, 9))
    _.set(result, 'dt_ajuste', line.substr(25, 4) + '-' + line.substr(23, 2) + '-' + line.substr(21, 2))
    _.set(result, 'vl_ajuste', Number(line.substr(29, 15)) / 100)
    _.set(result, 'tipo_ajuste', getIdTable(fileType, 'tipo_ajuste', line.substr(44, 1)))
    _.set(result, 'motivo_ajuste_cod', _.trim(line.substr(45, 2)))
    _.set(result, 'motivo_ajuste_desc', _.trim(line.substr(47, 28)))
    _.set(result, 'nro_cartao', _.trim(line.substr(75, 16)))
    _.set(result, 'dt_transacao', line.substr(95, 4) + '-' + line.substr(93, 2) + '-' + line.substr(91, 2))
    _.set(result, 'nro_rv_original', line.substr(99, 9))
    _.set(result, 'nro_carta', _.trim(line.substr(108, 15)))
    _.set(result, 'dt_carta', line.substr(127, 4) + '-' + line.substr(125, 2) + '-' + line.substr(123, 2))
    _.set(result, 'mes_referencia', line.substr(133, 4) + '-' + line.substr(131, 2))
    _.set(result, 'nro_pv_original', line.substr(137, 9))
    _.set(result, 'dt_rv_original', line.substr(150, 4) + '-' + line.substr(148, 2) + '-' + line.substr(146, 2))
    _.set(result, 'vl_transacao', Number(line.substr(154, 15)) / 100)
    _.set(result, 'tipo_movimento', getIdTable(fileType, 'tipo_movimento', line.substr(169, 1)))
    _.set(result, 'dt_credito', line.substr(174, 4) + '-' + line.substr(172, 2) + '-' + line.substr(170, 2))
    _.set(result, 'dt_lancamento', '')
    _.set(result, 'vl_novo', Number(line.substr(178, 15)) / 100)
    _.set(result, 'vl_original', Number(line.substr(193, 15)) / 100)
    _.set(result, 'vl_bruto', Number(line.substr(208, 15)) / 100)
    _.set(result, 'vl_cancelamento', Number(line.substr(223, 15)) / 100)
    _.set(result, 'nro_nsu', line.substr(238, 12))
    _.set(result, 'nro_autorizacao', _.trim(line.substr(250, 6)))
    _.set(result, 'tipo_debito', _.trim(line.substr(256, 1)))
    _.set(result, 'nro_ordem_debito', _.trim(line.substr(257, 11)))
    _.set(result, 'vl_debito_total', Number(line.substr(268, 15)) / 100)
    _.set(result, 'vl_pendente', Number(line.substr(283, 15)) / 100)
    _.set(result, 'bandeira_rv_origem', getIdTable(fileType, 'bandeiras', line.substr(298, 1)))
    _.set(result, 'bandeira_rv_ajustado', getIdTable(fileType, 'bandeiras', line.substr(299, 1)))
    _.set(result, 'modelo_lancamento', 'indefinido');
    _.set(result, 'tipo_lancamento', 'indefinido');
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))
    _.set(result, '_resumo_original', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'dt_rv_original', '') + '-' + _.get(result, 'nro_rv_original', ''))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)));

    const idMotivo = _.get(result, 'motivo_ajuste_cod', ''),
          idMovimento = _.get(result, 'tipo_movimento.code', 'N');
    let tipo_lancamento = 'indefinido',
        modelo_lancamento = 'indefinido';
    if (idsAluguel.indexOf(idMotivo) < 0) {
        if (idMovimento == 'N') {
            tipo_lancamento = 'chargeback';
            modelo_lancamento = 'chargeback';
        } else {
            tipo_lancamento = 'cancelamento';
            modelo_lancamento = 'cancelamento';
        }
    } else {
        tipo_lancamento = 'aluguel_equipamentos';
        modelo_lancamento = 'aluguel';
    }
    result['modelo_lancamento'] = modelo_lancamento;
    result['tipo_lancamento'] = tipo_lancamento;

    return result;
}

const parserRecord053 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_cartao', line.substr(3, 16))
    _.set(result, 'dt_transacao', line.substr(23, 4) + '-' + line.substr(21, 2) + '-' + line.substr(19, 2))
    _.set(result, 'nro_rv_original', line.substr(27, 9))
    _.set(result, 'nro_pv_original', line.substr(36, 9))
    _.set(result, 'vl_transacao', Number(line.substr(45, 15)) / 100)
    _.set(result, 'nro_nsu', line.substr(60, 12))
    _.set(result, 'nro_autorizacao', line.substr(72, 6))
    _.set(result, 'tid', line.substr(78, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(98, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))

    setTidPedido('035', result, parsed)

    return result;
}

const parserRecord036 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9),
        nro_parcela = line.substr(107, 5),
        tipo_plano = (nro_parcela === '01/01' ? 'rotativo' : 'parcelado');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tipo_plano', tipo_plano)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_documento', line.substr(12, 11))
    _.set(result, 'dt_lancamento', line.substr(27, 4) + '-' + line.substr(25, 2) + '-' + line.substr(23, 2))
    _.set(result, 'vl_lancamento', Number(line.substr(31, 15)) / 100)
    _.set(result, 'tipo_ajuste', getIdTable(fileType, 'tipo_ajuste', line.substr(46, 1)))
    _.set(result, 'banco', line.substr(47, 3))
    _.set(result, 'agencia', line.substr(50, 6))
    _.set(result, 'conta_corrente', line.substr(56, 11))
    _.set(result, 'nro_rv', line.substr(67, 9))
    _.set(result, 'data_rv', line.substr(80, 4) + '-' + line.substr(78, 2) + '-' + line.substr(76, 2))
    _.set(result, 'vl_credito', Number(line.substr(84, 15)) / 100)
    _.set(result, 'dt_vencimento', line.substr(103, 4) + '-' + line.substr(101, 2) + '-' + line.substr(99, 2))
    _.set(result, 'nro_parcela', nro_parcela)
    _.set(result, 'vl_bruto', Number(line.substr(112, 15)) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_desconto', Number(line.substr(127, 15)) / 100)
    _.set(result, 'vl_a_receber', 0)
    _.set(result, 'taxa_antecipacao', 0)
    _.set(result, 'vl_taxa_antecipacao', 0)
    _.set(result, 'nro_pv_original', line.substr(142, 9))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(151, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'data_rv', '') + '-' + _.get(result, 'nro_rv', ''))

    setCommissionRate(result);

    params.totals.qtd_record034_036 += 1;
    params.totals.vl_record034_036 += result.vl_lancamento;

    result['vl_taxa_antecipacao'] = _.round((result.vl_credito - result.vl_lancamento), 2);
    result['taxa_antecipacao'] = _.round(((result.vl_taxa_antecipacao/result.vl_lancamento) * 100), 6);
    result['vl_a_receber'] = _.round((result.vl_bruto - result.vl_desconto), 2);

    return result;
}

const parserRecord037 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'dt_credito', line.substr(23, 4) + '-' + line.substr(21, 2) + '-' + line.substr(19, 2))
    _.set(result, 'vl_credito', Number(line.substr(27, 15)) / 100)
    _.set(result, 'banco', line.substr(43, 3))
    _.set(result, 'agencia', line.substr(46, 6))
    _.set(result, 'conta_corrente', line.substr(52, 11))
    _.set(result, 'dt_geracao', line.substr(67, 4) + '-' + line.substr(65, 2) + '-' + line.substr(63, 2))
    _.set(result, 'dt_antecipada', line.substr(75, 4) + '-' + line.substr(73, 2) + '-' + line.substr(71, 2))
    _.set(result, 'vl_antecipado', (Number(line.substr(79, 15)) / 100))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord038 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_documento', line.substr(12, 11))
    _.set(result, 'dt_emissao', line.substr(27, 4) + '-' + line.substr(25, 2) + '-' + line.substr(23, 2))
    _.set(result, 'vl_debito', Number(line.substr(31, 15)) / 100)
    _.set(result, 'tipo_ajuste', getIdTable(fileType, 'tipo_ajuste', line.substr(46, 1)))
    _.set(result, 'banco', line.substr(47, 3))
    _.set(result, 'agencia', line.substr(50, 6))
    _.set(result, 'conta_corrente', line.substr(56, 11))
    _.set(result, 'nro_rv_original', line.substr(67, 9))
    _.set(result, 'dt_rv_original', line.substr(80, 4) + '-' + line.substr(78, 2) + '-' + line.substr(76, 2))
    _.set(result, 'vl_credito_original', Number(line.substr(84, 15)) / 100)
    _.set(result, 'motivo_debito_cod', _.trim(line.substr(99, 2)))
    _.set(result, 'motivo_debito_desc', _.trim(line.substr(101, 28)))
    _.set(result, 'nro_cartao', _.trim(line.substr(129, 16)))
    _.set(result, 'nro_carta', _.trim(line.substr(145, 15)))
    _.set(result, 'mes_referencia', line.substr(162, 4) + '-' + line.substr(160, 2))
    _.set(result, 'dt_carta', line.substr(170, 4) + '-' + line.substr(168, 2) + '-' + line.substr(166, 2))
    _.set(result, 'vl_cancelamento', Number(line.substr(174, 15)) / 100)
    _.set(result, 'nro_processo', line.substr(189, 15))
    _.set(result, 'nro_pv_original', line.substr(204, 9))
    _.set(result, 'data_transacao', line.substr(217, 4) + '-' + line.substr(215, 2) + '-' + line.substr(213, 2))
    _.set(result, 'nro_nsu', line.substr(221, 12))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'nro_resumo_debito', line.substr(233, 9))
    _.set(result, 'dt_debito', line.substr(246, 4) + '-' + line.substr(244, 2) + '-' + line.substr(242, 2))
    _.set(result, 'vl_original', Number(line.substr(250, 15)) / 100)
    _.set(result, 'nro_autorizacao', _.trim(line.substr(265, 6)))
    _.set(result, 'tipo_debito', line.substr(271, 1))
    _.set(result, 'vl_debito_total', Number(line.substr(272, 15)) / 100)
    _.set(result, 'vl_pendente', Number(line.substr(287, 15)) / 100)
    _.set(result, 'bandeira_rv_origem', getIdTable(fileType, 'bandeiras', line.substr(302, 1)))
    _.set(result, 'modelo_lancamento', 'indefinido');
    _.set(result, 'tipo_lancamento', 'indefinido');
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'dt_rv_original', '') + '-' + _.get(result, 'nro_rv_original', ''))

    const idMotivo = _.get(result, 'motivo_debito_cod', '');
    let tipo_lancamento = 'indefinido',
        modelo_lancamento = 'indefinido';
    if (idsAluguel.indexOf(idMotivo) < 0) {
        tipo_lancamento = 'chargeback';
        modelo_lancamento = 'chargeback';
    } else {
        tipo_lancamento = 'aluguel_equipamentos';
        modelo_lancamento = 'aluguel';
    }
    result['modelo_lancamento'] = modelo_lancamento;
    result['tipo_lancamento'] = tipo_lancamento;

    return result;
}

const parserRecord054 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_rv_original', line.substr(3, 9))
    _.set(result, 'nro_cartao', line.substr(12, 16))
    _.set(result, 'nro_pv_original', line.substr(28, 9))
    _.set(result, 'dt_transacao', line.substr(41, 4) + '-' + line.substr(39, 2) + '-' + line.substr(37, 2))
    _.set(result, 'nro_nsu', line.substr(45, 12))
    _.set(result, 'vl_original', Number(line.substr(57, 15)) / 100)
    _.set(result, 'nro_autorizacao', line.substr(72, 6))
    _.set(result, 'tid', line.substr(78, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(98, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))

    setTidPedido('038', result, parsed)

    return result;
}

const parserRecord043 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'nro_documento', line.substr(21, 11))
    _.set(result, 'dt_emissao', line.substr(36, 4) + '-' + line.substr(34, 2) + '-' + line.substr(32, 2))
    _.set(result, 'dt_credito', line.substr(44, 4) + '-' + line.substr(42, 2) + '-' + line.substr(40, 2))
    _.set(result, 'vl_credito', Number(line.substr(48, 15)) / 100)
    _.set(result, 'indicador', line.substr(63, 1))
    _.set(result, 'banco', line.substr(64, 3))
    _.set(result, 'agencia', line.substr(67, 6))
    _.set(result, 'conta_corrente', line.substr(73, 11))
    _.set(result, 'motivo_credito_cod', line.substr(84, 2))
    _.set(result, 'motivo_credito_desc', _.trim(line.substr(86, 28)))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(114, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'dt_emissao', '') + '-' + _.get(result, 'nro_rv', ''))

    return result;
}

const parserRecord044 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '');
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'nro_ordem_debito', _.trim(line.substr(12, 11)))
    _.set(result, 'dt_ordem_debito', line.substr(27, 4) + '-' + line.substr(25, 2) + '-' + line.substr(23, 2))
    _.set(result, 'vl_ordem_debito', Number(line.substr(31, 15)) / 100)
    _.set(result, 'motivo_ajuste_cod', _.trim(line.substr(46, 2)))
    _.set(result, 'motivo_ajuste_desc', _.trim(line.substr(48, 28)))
    _.set(result, 'nro_cartao', _.trim(line.substr(76, 16)))
    _.set(result, 'nro_cv_nsu', line.substr(92, 12))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'data_cv', line.substr(108, 4) + '-' + line.substr(106, 2) + '-' + line.substr(104, 2))
    _.set(result, 'nro_autorizacao', _.trim(line.substr(112, 6)))
    _.set(result, 'vl_original', Number(line.substr(118, 15)) / 100)
    _.set(result, 'nro_rv_original', line.substr(133, 9))
    _.set(result, 'dt_rv_original', line.substr(146, 4) + '-' + line.substr(144, 2) + '-' + line.substr(142, 2))
    _.set(result, 'nro_pv_original', line.substr(150, 9))
    _.set(result, 'nro_carta', _.trim(line.substr(159, 15)))
    _.set(result, 'dt_carta', line.substr(178, 4) + '-' + line.substr(176, 2) + '-' + line.substr(174, 2))
    _.set(result, 'nro_chargeback', _.trim(line.substr(182, 15)))
    _.set(result, 'mes_referencia', line.substr(199, 4) + '-' + line.substr(197, 2))
    _.set(result, 'vl_liquidado', Number(line.substr(203, 15)) / 100)
    _.set(result, 'dt_liquidacao', line.substr(222, 4) + '-' + line.substr(220, 2) + '-' + line.substr(218, 2))
    _.set(result, 'nro_retencao', _.trim(line.substr(226, 15)))
    _.set(result, 'meio_compensacao_cod', _.trim(line.substr(241, 2)))
    _.set(result, 'meio_compensacao_desc', _.trim(line.substr(243, 28)))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(271, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    return result;
}

const parserRecord055 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_cartao', line.substr(3, 16))
    _.set(result, 'nro_cv_nsu', line.substr(19, 12))
    _.set(result, 'dt_original', line.substr(35, 4) + '-' + line.substr(33, 2) + '-' + line.substr(31, 2))
    _.set(result, 'nro_autorizacao', line.substr(39, 6))
    _.set(result, 'vl_original', Number(line.substr(45, 15)) / 100)
    _.set(result, 'nro_rv_original', line.substr(60, 9))
    _.set(result, 'nro_pv_original', line.substr(69, 9))
    _.set(result, 'tid', line.substr(78, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(98, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    setTidPedido('044', result, parsed)

    return result;
}

const parserRecord045 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '');
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'nro_ordem_debito', _.trim(line.substr(12, 11)))
    _.set(result, 'dt_ordem_debito', line.substr(27, 4) + '-' + line.substr(25, 2) + '-' + line.substr(23, 2))
    _.set(result, 'vl_ordem_debito', Number(line.substr(31, 15)) / 100)
    _.set(result, 'motivo_ajuste_cod', _.trim(line.substr(46, 2)))
    _.set(result, 'motivo_ajuste_desc', _.trim(line.substr(48, 28)))
    _.set(result, 'nro_cartao', _.trim(line.substr(76, 16)))
    _.set(result, 'nro_cv_nsu', line.substr(92, 12))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'data_cv', line.substr(108, 4) + '-' + line.substr(106, 2) + '-' + line.substr(104, 2))
    _.set(result, 'nro_autorizacao', _.trim(line.substr(112, 6)))
    _.set(result, 'vl_original', Number(line.substr(118, 15)) / 100)
    _.set(result, 'nro_rv_original', line.substr(133, 9))
    _.set(result, 'dt_rv_original', line.substr(146, 4) + '-' + line.substr(144, 2) + '-' + line.substr(142, 2))
    _.set(result, 'nro_pv_original', line.substr(150, 9))
    _.set(result, 'nro_carta', _.trim(line.substr(159, 15)))
    _.set(result, 'dt_carta', line.substr(178, 4) + '-' + line.substr(176, 2) + '-' + line.substr(174, 2))
    _.set(result, 'nro_chargeback', _.trim(line.substr(182, 15)))
    _.set(result, 'mes_referencia', line.substr(199, 4) + '-' + line.substr(197, 2))
    _.set(result, 'vl_liquidado', Number(line.substr(203, 15)) / 100)
    _.set(result, 'dt_liquidacao', line.substr(222, 4) + '-' + line.substr(220, 2) + '-' + line.substr(218, 2))
    _.set(result, 'nro_retencao', _.trim(line.substr(226, 15)))
    _.set(result, 'meio_compensacao_cod', _.trim(line.substr(241, 2)))
    _.set(result, 'meio_compensacao_desc', _.trim(line.substr(243, 28)))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(271, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    return result;
}

const parserRecord056 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_cartao', line.substr(3, 16))
    _.set(result, 'nro_cv_nsu', line.substr(19, 12))
    _.set(result, 'dt_original', line.substr(35, 4) + '-' + line.substr(33, 2) + '-' + line.substr(31, 2))
    _.set(result, 'nro_autorizacao', line.substr(39, 6))
    _.set(result, 'vl_original', Number(line.substr(45, 15)) / 100)
    _.set(result, 'nro_rv_original', line.substr(60, 9))
    _.set(result, 'nro_pv_original', line.substr(69, 9))
    _.set(result, 'tid', line.substr(78, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(98, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    setTidPedido('045', result, parsed)

    return result;
}

const parserRecord049 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv_original', line.substr(3, 9))
    _.set(result, 'nro_rv_original', line.substr(12, 9))
    _.set(result, 'nro_referencia', line.substr(21, 15))
    _.set(result, 'dt_credito', line.substr(40, 4) + '-' + line.substr(38, 2) + '-' + line.substr(36, 2))
    _.set(result, 'vl_novo', Number(line.substr(44, 15)) / 100)
    _.set(result, 'vl_original', Number(line.substr(59, 15)) / 100)
    _.set(result, 'vl_ajuste', Number(line.substr(74, 15)) / 100)
    _.set(result, 'dt_cancelamento', line.substr(93, 4) + '-' + line.substr(91, 2) + '-' + line.substr(89, 2))
    _.set(result, 'vl_rv', Number(line.substr(97, 15)) / 100)
    _.set(result, 'vl_cancelamento', Number(line.substr(112, 15)) / 100)
    _.set(result, 'nro_cartao', _.trim(line.substr(127, 16)))
    _.set(result, 'dt_transacao', line.substr(147, 4) + '-' + line.substr(145, 2) + '-' + line.substr(143, 2))
    _.set(result, 'nro_nsu', line.substr(151, 12))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'tipo_debito', _.trim(line.substr(163, 1)))
    _.set(result, 'nro_parcela', _.trim(line.substr(164, 2)))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(166, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))

    return result;
}

const parserRecord057 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv_original', line.substr(3, 9))
    _.set(result, 'nro_rv_original', line.substr(12, 9))
    _.set(result, 'vl_original', Number(line.substr(21, 15)) / 100)
    _.set(result, 'nro_cartao', line.substr(36, 16))
    _.set(result, 'dt_transacao', line.substr(56, 4) + '-' + line.substr(54, 2) + '-' + line.substr(52, 2))
    _.set(result, 'nro_nsu', line.substr(60, 12))
    _.set(result, 'tid', line.substr(72, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(92, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))

    setTidPedido('049', result, parsed)

    return result;
}

const parserRecord050 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv_matriz', line.substr(3, 9))
    _.set(result, 'qtd_resumos', Number(line.substr(12, 6)))
    _.set(result, 'vl_creditos_normais', Number(line.substr(18, 15)) / 100)
    _.set(result, 'qtd_creditos_antecipados', Number(line.substr(33, 6)))
    _.set(result, 'vl_antecipado', Number(line.substr(39, 15)) / 100)
    _.set(result, 'qtd_ajustes_credito', Number(line.substr(54, 4)))
    _.set(result, 'vl_ajustes_credito', Number(line.substr(58, 15)) / 100)
    _.set(result, 'qtd_ajutes_debito', Number(line.substr(73, 6)))
    _.set(result, 'vl_ajustes_debito', Number(line.substr(79, 15)) / 100)
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord052 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'qtd_matrizes', Number(line.substr(3, 4)))
    _.set(result, 'qtd_registros', Number(line.substr(7, 6)))
    _.set(result, 'nro_pv_grupo', line.substr(13, 9))
    _.set(result, 'qtd_resumos', Number(line.substr(22, 4)))
    _.set(result, 'vl_creditos_normais', Number(line.substr(26, 15)) / 100)
    _.set(result, 'qtd_creditos_antecipados', Number(line.substr(41, 6)))
    _.set(result, 'vl_antecipado', Number(line.substr(47, 15)) / 100)
    _.set(result, 'qtd_ajustes_credito', Number(line.substr(62, 4)))
    _.set(result, 'vl_ajustes_credito', Number(line.substr(66, 15)) / 100)
    _.set(result, 'qtd_ajutes_debito', Number(line.substr(81, 4)))
    _.set(result, 'vl_ajustes_debito', Number(line.substr(85, 15)) / 100)
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_record052 += (result.qtd_resumos + result.qtd_creditos_antecipados);
    params.totals.vl_record052 += (result.vl_creditos_normais + result.vl_antecipado);

    return result;
}

const parserRecord999 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'info', _.trim(line.substr(3, 600)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const setDataToRecord035 = (parsed) => {
    for (var i = 0; i < parsed.length; i++) {
        let record = parsed[i],
            registro = _.get(record, 'registro', '');

        if (registro == '035') {
            let filter034 = {
                    'registro': '034',
                    'nro_pv_original': _.get(record, 'nro_pv_ajustado', ''),
                    'nro_rv': _.get(record, 'nro_rv_ajustado', '')
                },
                filter036 = {
                    'registro': '036',
                    'nro_pv_original': _.get(record, 'nro_pv_ajustado', ''),
                    'nro_rv': _.get(record, 'nro_rv_ajustado', '')
                },
                resumoLiquidacao = _.find(parsed, filter034),
                resumoAntecipacao = _.find(parsed, filter036),
                resumo_venda = '',
                dt_lancamento = '';

            if (resumoLiquidacao) {
                resumo_venda = _.get(resumoLiquidacao, '_resumo_venda', '');
                dt_lancamento = _.get(resumoLiquidacao, 'dt_lancamento', '');
            }
            if (resumoAntecipacao) {
                resumo_venda = _.get(resumoAntecipacao, '_resumo_venda', '');
                dt_lancamento = _.get(resumoAntecipacao, 'dt_lancamento', '');
            }
            if (_.isEmpty(dt_lancamento) == true) {
                dt_lancamento = _.get(record, 'dt_credito', '');
            }
            if (_.isEmpty(resumo_venda) == true) {
                let dt_rv = '';
                if (record.nro_rv_ajustado == record.nro_rv_original) {
                    dt_rv = _.get(record, 'dt_transacao', '');
                } else {
                    dt_rv = _.get(record, 'dt_credito', '');
                }
                resumo_venda = _.get(record, 'nro_pv_ajustado', '') + '-' + dt_rv + '-' + _.get(record, 'nro_rv_ajustado', '')
            }
            record['_resumo_venda'] = resumo_venda;
            record['dt_lancamento'] = dt_lancamento;
        }
    }
}

export const parser = (params, callback) => {
    return new Promise((resolve, reject) => {
        try {
            let fullPath = _.get(params, 'fileInfo.FullPath', ''),
                fileId = _.get(params, 'fileInfo._id', ''),
                fileType = _.get(params, 'fileInfo.FileType', ''),
                fileName = _.get(params, 'fileInfo.OriginalName', ''),
                fileKey = '', tags = _.get(params, 'tags', []);

            if (_.isEmpty(fullPath) == true) {
                throw new Error('Caminho do arquivo não informado.');
            }

            fs.readFile(fullPath, 'utf8', function(err, contents) {
                if (err) {
                    throw err;
                }

                const genneral = ['040','041','042'];
                let lines = contents.split('\n'),
                    totals = {
                        'qtd_record034_036': 0,
                        'qtd_record052': 0,
                        'vl_record034_036': 0,
                        'vl_record052': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 3),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, fileType, totals, lineNumber, tags };

                    if (genneral.indexOf(type) >= 0) {
                        parsed.push(parserRecord999(args));
                    }

                    if (type == '030') {
                        let temp = [];
                        const record030 = parserRecord030(args);
                        temp.push(_.get(record030, 'nro_sequencial', ''));
                        temp.push(_.get(record030, 'dt_emissao', ''));
                        temp.push(_.get(record030, 'tipo_processamento', ''));
                        fileKey = temp.join('');
                        parsed.push(record030);
                    } else if (type == '032') {
                        parsed.push(parserRecord032(args));
                    } else if (type == '034') {
                        parsed.push(parserRecord034(args));
                    } else if (type == '035') {
                        parsed.push(parserRecord035(args));
                    } else if (type == '053') {
                        parsed.push(parserRecord053(args, parsed));
                    } else if (type == '036') {
                        parsed.push(parserRecord036(args));
                    } else if (type == '037') {
                        parsed.push(parserRecord037(args));
                    } else if (type == '038') {
                        parsed.push(parserRecord038(args));
                    } else if (type == '054') {
                        parsed.push(parserRecord054(args, parsed));
                    } else if (type == '043') {
                        parsed.push(parserRecord043(args));
                    } else if (type == '044') {
                        parsed.push(parserRecord044(args));
                    } else if (type == '055') {
                        parsed.push(parserRecord055(args, parsed));
                    } else if (type == '045') {
                        parsed.push(parserRecord045(args));
                    } else if (type == '056') {
                        parsed.push(parserRecord056(args, parsed));
                    } else if (type == '049') {
                        parsed.push(parserRecord049(args));
                    } else if (type == '057') {
                        parsed.push(parserRecord057(args, parsed));
                    } else if (type == '050') {
                        parsed.push(parserRecord050(args));
                    } else if (type == '052') {
                        parsed.push(parserRecord052(args));
                    }
                    params['totals'] = args.totals;
                }

                setDataToRecord035(parsed);

                params['parsed'] = parsed;
                params['fileName'] = fileName;

                return resolve(params);
            });
        } catch (error) {
            throw error;
            reject(error)
        }
    })
}

export const validate = (params) => {
    try {
        var errorMessage = '',
            difQuantity = _.round(params.totals.qtd_record034_036 - params.totals.qtd_record052, 2),
            difValues = _.round(params.totals.vl_record034_036 - params.totals.vl_record052, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Transações: ' + params.totals.qtd_record034_036 + ' Qt.Resumos: ' + params.totals.qtd_record052;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Transações: ' + _.round(params.totals.vl_record034_036, 2) + ' Vl.Resumos: ' + _.round(params.totals.vl_record052, 2) + ' Diferença: '+ difValues;
        }
        if (errorMessage != '') {
            params['status'] = 'error';
            params['errorMessage'] = _.trim(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw error;
    }

    return params;
}

export const saveData = async (params) => {
    const genneral = ['040','041','042','043'];
    const parsed = params.parsed;

    try {
        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  id = _.get(model, '_id', ''),
                  registro = _.get(model, 'registro', ''),
                  filter = { '_id': id };

            if (genneral.indexOf(registro) >= 0) {
                await mongodb.cldr_rede_financeiro_record999.upsert(filter, model);
            }
            if (registro == '030') {
                await mongodb.cldr_rede_financeiro_record030.upsert(filter, model);
            } else if (registro == '032') {
                await mongodb.cldr_rede_financeiro_record032.upsert(filter, model);
            } else if (registro == '034') {
                await mongodb.cldr_rede_financeiro_record034.upsert(filter, model);
            } else if (registro == '035') {
                await mongodb.cldr_rede_financeiro_record035.upsert(filter, model);
            } else if (registro == '053') {
                await mongodb.cldr_rede_financeiro_record053.upsert(filter, model);
            } else if (registro == '036') {
                await mongodb.cldr_rede_financeiro_record036.upsert(filter, model);
            } else if (registro == '037') {
                await mongodb.cldr_rede_financeiro_record037.upsert(filter, model);
            } else if (registro == '038') {
                await mongodb.cldr_rede_financeiro_record038.upsert(filter, model);
            } else if (registro == '054') {
                await mongodb.cldr_rede_financeiro_record054.upsert(filter, model);
            } else if (registro == '043') {
                await mongodb.cldr_rede_financeiro_record043.upsert(filter, model);
            } else if (registro == '044') {
                await mongodb.cldr_rede_financeiro_record044.upsert(filter, model);
            } else if (registro == '055') {
                await mongodb.cldr_rede_financeiro_record055.upsert(filter, model);
            } else if (registro == '045') {
                await mongodb.cldr_rede_financeiro_record045.upsert(filter, model);
            } else if (registro == '056') {
                await mongodb.cldr_rede_financeiro_record056.upsert(filter, model);
            } else if (registro == '049') {
                await mongodb.cldr_rede_financeiro_record049.upsert(filter, model);
            } else if (registro == '057') {
                await mongodb.cldr_rede_financeiro_record057.upsert(filter, model);
            } else if (registro == '050') {
                await mongodb.cldr_rede_financeiro_record050.upsert(filter, model);
            } else if (registro == '052') {
                await mongodb.cldr_rede_financeiro_record052.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
