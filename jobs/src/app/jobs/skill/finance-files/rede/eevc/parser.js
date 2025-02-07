import _ from 'lodash'
import fs from 'fs'
import { mongodb } from 'app/models'
import { md5, sizedField } from 'app/lib/utils'
import { getIdTable } from 'app/jobs/skill/finance-files/rede/common/tables'
import { setTidPedido, parserForKeys, setCommissionRate } from 'app/jobs/skill/finance-files/rede/common/utils'
import { getTransactionKeys, getTag } from 'app/jobs/skill/commons/utils'

const parserRecord002 = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'dt_emissao', line.substr(7, 4) + '-' + line.substr(5, 2) + '-' + line.substr(3, 2))
    _.set(result, 'info_01', _.trim(line.substr(11, 8)))
    _.set(result, 'info_02', _.trim(line.substr(19, 30)))
    _.set(result, 'nome_comercial', _.trim(line.substr(49, 22)))
    _.set(result, 'nro_sequencial', line.substr(71, 6))
    _.set(result, 'nr_pv_matriz', line.substr(77, 9))
    _.set(result, 'tipo_processamento', _.trim(line.substr(86, 15)))
    _.set(result, 'versao_arquivo', _.trim(line.substr(101, 20)))
    _.set(result, 'livre', _.trim(line.substr(121, 903)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord004 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_matriz', _.trim(line.substr(3, 9)))
    _.set(result, 'nome_comercial', _.trim(line.substr(12, 22)))
    _.set(result, 'livre', _.trim(line.substr(34, 990)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord005 = (params) => {
    let result = {}, keyNsu = [],
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, '_keys', {})
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'nro_cartao', line.substr(21, 16))
    _.set(result, 'vl_transacao', Number(line.substr(37, 15)) / 100)
    _.set(result, 'dt_transacao', line.substr(56, 4) + '-' + line.substr(54, 2) + '-' + line.substr(52, 2))
    _.set(result, 'referencia', line.substr(60, 15))
    _.set(result, 'nro_processo', line.substr(75, 15))
    _.set(result, 'nro_cv_nsu', line.substr(90, 12))
    _.set(result, 'nro_autorizacao', line.substr(102, 6))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'cod_request', getIdTable(fileType, 'request', line.substr(108, 4)))
    _.set(result, 'dt_limite', line.substr(116, 4) + '-' + line.substr(114, 2) + '-' + line.substr(112, 2))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(120, 1)))
    _.set(result, 'livre', _.trim(line.substr(121, 903).replace(/\n/, '')))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'dt_transacao', '') + '-' + _.get(result, 'nro_rv', ''))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)));

    return result;
}

const parserRecord033 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'nro_cartao', line.substr(21, 16))
    _.set(result, 'data', line.substr(41, 4) + '-' + line.substr(39, 2) + '-' + line.substr(37, 2))
    _.set(result, 'nro_cv_nsu', line.substr(45, 12))
    _.set(result, 'nro_autorizacao', line.substr(57, 6))
    _.set(result, 'tid', line.substr(63, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(83, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    setTidPedido('005', result, parsed)

    return result;
}

const parserRecord006 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_parcela', '01/01')
    _.set(result, 'tipo_plano', 'rotativo')
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'banco', line.substr(21, 3))
    _.set(result, 'agencia', line.substr(24, 5))
    _.set(result, 'conta_corrente', line.substr(29, 11))
    _.set(result, 'data', line.substr(44, 4) + '-' + line.substr(42, 2) + '-' + line.substr(40, 2))
    _.set(result, 'qt_cv_nsu', Number(line.substr(48, 5)))
    _.set(result, 'vl_bruto', Number(line.substr(53, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(68, 15)) / 100)
    _.set(result, 'vl_rejeitado', Number(line.substr(83, 15)) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_desconto', Number(line.substr(98, 15)) / 100)
    _.set(result, 'vl_liquido', Number(line.substr(113, 15)) / 100)
    _.set(result, 'dt_credito', line.substr(132, 4) + '-' + line.substr(130, 2) + '-' + line.substr(128, 2))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(136, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'data', '') + '-' + _.get(result, 'nro_rv', ''))

    setCommissionRate(result);

    params.totals.qtd_record006_010 += result.qt_cv_nsu;
    params.totals.vl_record006_010 += result.vl_bruto;

    return result;
}

const parserRecord008 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, '_keys', {})
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'data', line.substr(25, 4) + '-' + line.substr(23, 2) + '-' + line.substr(21, 2))
    _.set(result, 'vl_bruto', Number(line.substr(37, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(52, 15)) / 100)
    _.set(result, 'nro_cartao', line.substr(67, 16))
    _.set(result, 'status_cv_nsu', getIdTable(fileType, 'status', line.substr(83, 3)))
    _.set(result, 'nro_cv_nsu', line.substr(86, 12))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'nro_referencia', _.trim(line.substr(98, 13)))
    _.set(result, 'vl_desconto', Number(line.substr(111, 15)) / 100)
    _.set(result, 'nro_autorizacao', line.substr(126, 6))
    _.set(result, 'hora_transacao', line.substr(132, 2) + ':' + line.substr(134, 2) + ':' + line.substr(136, 2))
    _.set(result, 'tipo_captura', getIdTable(fileType, 'tipo_captura', line.substr(202, 1)))
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_liquido', Number(line.substr(203, 15)) / 100)
    _.set(result, 'dt_credito', '')
    _.set(result, 'nro_terminal', line.substr(218, 8))
    _.set(result, 'sigla_pais', getIdTable(fileType, 'sigla_pais', _.trim(line.substr(226, 3))))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(229, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv_nsu', ''))
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'data', '') + '-' + _.get(result, 'nro_rv', ''))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)));

    setCommissionRate(result);

    params.totals.qtd_record008_012 += 1;
    params.totals.vl_record008_012 += result.vl_bruto;

    let filterResumo = {
            'registro': '006',
            '_resumo_venda': _.get(result, '_resumo_venda', '')
        },
        resumo = _.findLast(parsed, filterResumo);
    if (resumo) {
        result['dt_credito'] = _.get(resumo, 'dt_credito', '');
    }

    return result;
}

const parserRecord034 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'data', line.substr(25, 4) + '-' + line.substr(23, 2) + '-' + line.substr(21, 2))
    _.set(result, 'valor', Number(line.substr(29, 15)) / 100)
    _.set(result, 'nro_cartao', line.substr(44, 16))
    _.set(result, 'nro_cv_nsu', line.substr(60, 12))
    _.set(result, 'nro_autorizacao', line.substr(72, 6))
    _.set(result, 'tid', line.substr(78, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(98, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    setTidPedido('008', result, parsed)

    return result;
}

const parserRecord010 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_parcela', '01/01')
    _.set(result, 'tipo_plano', 'parcelado')
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'banco', line.substr(21, 3))
    _.set(result, 'agencia', line.substr(24, 5))
    _.set(result, 'conta_corrente', line.substr(29, 11))
    _.set(result, 'data', line.substr(44, 4) + '-' + line.substr(42, 2) + '-' + line.substr(40, 2))
    _.set(result, 'qt_cv_nsu', Number(line.substr(48, 5)))
    _.set(result, 'vl_bruto', Number(line.substr(53, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(68, 15)) / 100)
    _.set(result, 'vl_rejeitado', Number(line.substr(83, 15)) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_desconto', Number(line.substr(98, 15)) / 100)
    _.set(result, 'vl_liquido', Number(line.substr(113, 15)) / 100)
    _.set(result, 'dt_credito', line.substr(132, 4) + '-' + line.substr(130, 2) + '-' + line.substr(128, 2))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(136, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'data', '') + '-' + _.get(result, 'nro_rv', ''))

    setCommissionRate(result);

    params.totals.qtd_record006_010 += result.qt_cv_nsu;
    params.totals.vl_record006_010 += result.vl_bruto;

    return result;
}

const parserRecord012 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_pv = line.substr(3, 9);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, '_keys', {})
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'data', line.substr(25, 4) + '-' + line.substr(23, 2) + '-' + line.substr(21, 2))
    _.set(result, 'vl_bruto', Number(line.substr(37, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(52, 15)) / 100)
    _.set(result, 'nro_cartao', line.substr(67, 16))
    _.set(result, 'status_cv_nsu', getIdTable(fileType, 'status', line.substr(83, 3)))
    _.set(result, 'nro_parcelas', line.substr(86, 2))
    _.set(result, 'nro_cv_nsu', line.substr(88, 12))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'nro_referencia', _.trim(line.substr(100, 13)))
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_desconto', Number(line.substr(113, 15)) / 100)
    _.set(result, 'nro_autorizacao', line.substr(128, 6))
    _.set(result, 'hora_transacao', line.substr(134, 2) + ':' + line.substr(136, 2) + ':' + line.substr(138, 2))
    _.set(result, 'tipo_captura', getIdTable(fileType, 'tipo_captura', line.substr(204, 1)))
    _.set(result, 'vl_liquido', Number(line.substr(205, 15)) / 100)
    _.set(result, 'vl_primeira_parcela', Number(line.substr(220, 15)) / 100)
    _.set(result, 'vl_demais_parcelas', Number(line.substr(235, 15)) / 100)
    _.set(result, 'dt_credito', '')
    _.set(result, 'nro_terminal', line.substr(250, 8))
    _.set(result, 'sigla_pais', getIdTable(fileType, 'sigla_pais', _.trim(line.substr(258, 3))))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(261, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv_nsu', ''))
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'data', '') + '-' + _.get(result, 'nro_rv', ''))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)));

    setCommissionRate(result);

    params.totals.qtd_record008_012 += 1;
    params.totals.vl_record008_012 += result.vl_bruto;

    let filterResumo = {
            'registro': '010',
            '_resumo_venda': _.get(result, '_resumo_venda', '')
        },
        resumo = _.findLast(parsed, filterResumo);
    if (resumo) {
        result['dt_credito'] = _.get(resumo, 'dt_credito', '');
    }

    return result;
}

const parserRecord035 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'data', line.substr(25, 4) + '-' + line.substr(23, 2) + '-' + line.substr(21, 2))
    _.set(result, 'valor', Number(line.substr(29, 15)) / 100)
    _.set(result, 'nro_cartao', line.substr(44, 16))
    _.set(result, 'nro_cv_nsu', line.substr(60, 12))
    _.set(result, 'nro_autorizacao', line.substr(72, 6))
    _.set(result, 'tid', line.substr(78, 20))
    _.set(result, 'nro_pedido', _.trim(line.substr(98, 30)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv_nsu', ''))

    setTidPedido('012', result, parsed)

    return result;
}

const parserRecord014 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', line.substr(3, 9))
    _.set(result, 'nro_rv', line.substr(12, 9))
    _.set(result, 'dt_rv', line.substr(25, 4) + '-' + line.substr(23, 2) + '-' + line.substr(21, 2))
    _.set(result, 'brancos', line.substr(29, 8))
    _.set(result, 'nro_parcela', line.substr(37, 2))
    _.set(result, 'vl_bruto', Number(line.substr(39, 15)) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_desconto', Number(line.substr(54, 15)) / 100)
    _.set(result, 'vl_liquido', Number(line.substr(69, 15)) / 100)
    _.set(result, 'dt_credito', line.substr(88, 4) + '-' + line.substr(86, 2) + '-' + line.substr(84, 2))
    _.set(result, 'livre', _.trim(line.substr(92, 932)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'dt_rv', '') + '-' + _.get(result, 'nro_rv', ''))

    setCommissionRate(result);

    return result;
}

const parserRecord026 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv_matriz', line.substr(5, 9))
    _.set(result, 'vl_total_bruto', Number(line.substr(12, 15)) / 100)
    _.set(result, 'qtd_cv_rejeitados', Number(line.substr(27, 6)))
    _.set(result, 'vl_rejeitado', Number(line.substr(33, 15)) / 100)
    _.set(result, 'vl_rotativo', Number(line.substr(48, 15)) / 100)
    _.set(result, 'vl_parcelado', Number(line.substr(63, 15)) / 100)
    _.set(result, 'vl_iata', Number(line.substr(78, 15)) / 100)
    _.set(result, 'vl_dolar', Number(line.substr(93, 15)) / 100)
    _.set(result, 'vl_desconto', Number(line.substr(108, 15)) / 100)
    _.set(result, 'vl_liquido', Number(line.substr(123, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(138, 15)) / 100)
    _.set(result, 'vl_taxa_embarque', Number(line.substr(153, 15)) / 100)
    _.set(result, 'qtd_cv_acatados', Number(line.substr(168, 6)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord028 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_venda', 'credito')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'qtd_matrizes', Number(line.substr(3, 4)))
    _.set(result, 'qtd_registros', Number(line.substr(7, 6)))
    _.set(result, 'nro_pv_grupo', line.substr(13, 9))
    _.set(result, 'vl_total_bruto', Number(line.substr(22, 15)) / 100)
    _.set(result, 'qtd_cv_rejeitados', Number(line.substr(37, 6)))
    _.set(result, 'vl_rejeitado', Number(line.substr(43, 15)) / 100)
    _.set(result, 'vl_rotativo', Number(line.substr(58, 15)) / 100)
    _.set(result, 'vl_parcelado', Number(line.substr(73, 15)) / 100)
    _.set(result, 'vl_iata', Number(line.substr(88, 15)) / 100)
    _.set(result, 'vl_dolar', Number(line.substr(103, 15)) / 100)
    _.set(result, 'vl_desconto', Number(line.substr(118, 15)) / 100)
    _.set(result, 'vl_liquido', Number(line.substr(133, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(148, 15)) / 100)
    _.set(result, 'vl_taxa_embarque', Number(line.substr(163, 15)) / 100)
    _.set(result, 'qtd_cv_acatados', Number(line.substr(178, 6)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
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

                let lines = contents.split('\n'),
                    totals = {
                        'qtd_record006_010': 0,
                        'qtd_record008_012': 0,
                        'vl_record006_010': 0,
                        'vl_record008_012': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 3),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, fileType, totals, lineNumber, tags };

                    if (type == '002') {
                        let temp = [];
                        const record002 = parserRecord002(args);
                        temp.push(_.get(record002, 'nro_sequencial', ''));
                        temp.push(_.get(record002, 'dt_emissao', ''));
                        temp.push(_.get(record002, 'tipo_processamento', ''));
                        fileKey = temp.join('');
                        parsed.push(record002);
                    } else if (type == '004') {
                        parsed.push(parserRecord004(args));
                    } else if (type == '005') {
                        parsed.push(parserRecord005(args));
                    } else if (type == '033') {
                        parsed.push(parserRecord033(args, parsed));
                    } else if (type == '006') {
                        parsed.push(parserRecord006(args));
                    } else if (type == '008') {
                        parsed.push(parserRecord008(args, parsed));
                    } else if (type == '034') {
                        parsed.push(parserRecord034(args, parsed));
                    } else if (type == '010') {
                        parsed.push(parserRecord010(args));
                    } else if (type == '012') {
                        parsed.push(parserRecord012(args, parsed));
                    } else if (type == '035') {
                        parsed.push(parserRecord035(args, parsed));
                    } else if (type == '014') {
                        parsed.push(parserRecord014(args));
                    } else if (type == '026') {
                        parsed.push(parserRecord026(args));
                    } else if (type == '028') {
                        parsed.push(parserRecord028(args));
                    }
                    params['totals'] = args.totals;
                }

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
            difQuantity = _.round(params.totals.qtd_record008_012 - params.totals.qtd_record006_010, 2),
            difValues = _.round(params.totals.vl_record008_012 - params.totals.vl_record006_010, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Transações: ' + params.totals.qtd_record008_012 + ' Qt.Resumos: ' + params.totals.qtd_record006_010;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Transações: ' + _.round(params.totals.vl_record008_012, 2) + ' Vl.Resumos: ' + _.round(params.totals.vl_record006_010, 2) + ' Diferença: '+ difValues;
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
    const parsed = params.parsed;

    try {
        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  id = _.get(model, '_id', ''),
                  registro = _.get(model, 'registro', ''),
                  filter = { '_id': id };

            if (registro == '002') {
                await mongodb.cldr_rede_credito_record002.upsert(filter, model);
            } else if (registro == '004') {
                await mongodb.cldr_rede_credito_record004.upsert(filter, model);
            } else if (registro == '005') {
                await mongodb.cldr_rede_credito_record005.upsert(filter, model);
            } else if (registro == '033') {
                await mongodb.cldr_rede_credito_record033.upsert(filter, model);
            } else if (registro == '006') {
                await mongodb.cldr_rede_credito_record006.upsert(filter, model);
            } else if (registro == '008') {
                await mongodb.cldr_rede_credito_record008.upsert(filter, model);
            } else if (registro == '034') {
                await mongodb.cldr_rede_credito_record034.upsert(filter, model);
            } else if (registro == '010') {
                await mongodb.cldr_rede_credito_record010.upsert(filter, model);
            } else if (registro == '012') {
                await mongodb.cldr_rede_credito_record012.upsert(filter, model);
            } else if (registro == '035') {
                await mongodb.cldr_rede_credito_record035.upsert(filter, model);
            } else if (registro == '014') {
                await mongodb.cldr_rede_credito_record014.upsert(filter, model);
            } else if (registro == '026') {
                await mongodb.cldr_rede_credito_record026.upsert(filter, model);
            } else if (registro == '028') {
                await mongodb.cldr_rede_credito_record028.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
