import _ from 'lodash'
import fs from 'fs'
import { md5, sizedField } from 'app/lib/utils'
import { mongodb } from 'app/models'
import { getIdTable } from 'app/jobs/skill/finance-files/bradesco/common/tables'

const parserRecord0 = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'uso_banco_1', _.trim(line.substr(8, 9)));
    _.set(result, 'tipo_inscricao', getIdTable('tipo_inscricao', _.trim(line.substr(17, 1))));
    _.set(result, 'nro_inscricao', line.substr(18, 14));
    _.set(result, 'cod_empresa', line.substr(32, 20));
    _.set(result, 'agencia', line.substr(52, 5));
    _.set(result, 'dig_agencia', line.substr(57, 1));
    _.set(result, 'conta_corrente', line.substr(58, 12));
    _.set(result, 'dig_conta_corrente', line.substr(70, 1));
    _.set(result, 'dig_agencia_conta', _.trim(line.substr(71, 1)));
    _.set(result, 'nome_empresa', _.trim(line.substr(72, 30)));
    _.set(result, 'nome_banco', _.trim(line.substr(102, 30)));
    _.set(result, 'uso_banco_2', line.substr(132, 10));
    _.set(result, 'cod_retorno', line.substr(142, 1));
    _.set(result, 'data_geracao', line.substr(147, 4) + '-' + line.substr(145, 2) + '-' + line.substr(143, 2));
    _.set(result, 'hora_geracao', line.substr(151, 2) + ':' + line.substr(153, 2) + ':' + line.substr(155, 2));
    _.set(result, 'nro_sequencial', line.substr(157, 6));
    _.set(result, 'nro_versao', line.substr(163, 3));
    _.set(result, 'densidade', line.substr(166, 5));
    _.set(result, 'uso_banco_3', _.trim(line.substr(171, 20)));
    _.set(result, 'uso_banco_4', _.trim(line.substr(191, 20)));
    _.set(result, 'cod_convenio', _.trim(line.substr(211, 22)));
    _.set(result, 'uso_banco_5', _.trim(line.substr(233, 7)));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord1 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params,
        valor_inicial = (Number(line.substr(150, 18))/100),
        valor_saldo = valor_inicial,
        situacao_saldo = line.substr(168, 1);

    if (situacao_saldo == 'D') {
        valor_saldo = (-1 * valor_inicial);
    }

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'tipo_operacao', line.substr(8, 1));
    _.set(result, 'tipo_servico', line.substr(9, 2));
    _.set(result, 'forma_lancamento', line.substr(11, 2));
    _.set(result, 'nro_versao', line.substr(13, 3));
    _.set(result, 'uso_banco_1', _.trim(line.substr(16, 1)));
    _.set(result, 'tipo_inscricao', getIdTable('tipo_inscricao', _.trim(line.substr(17, 1))));
    _.set(result, 'nro_inscricao', line.substr(18, 14));
    _.set(result, 'cod_empresa', line.substr(32, 20));
    _.set(result, 'agencia', line.substr(52, 5));
    _.set(result, 'dig_agencia', line.substr(57, 1));
    _.set(result, 'conta_corrente', line.substr(58, 12));
    _.set(result, 'dig_conta_corrente', _.trim(line.substr(70, 1)));
    _.set(result, 'dig_agencia_conta', line.substr(71, 1));
    _.set(result, 'nome_empresa', _.trim(line.substr(72, 30)));
    _.set(result, 'segunda_linha', _.trim(line.substr(102, 40)));
    _.set(result, 'data_saldo', line.substr(146, 4) + '-' + line.substr(144, 2) + '-' + line.substr(142, 2));
    _.set(result, 'valor_inicial', valor_inicial);
    _.set(result, 'valor_saldo', valor_saldo);
    _.set(result, 'situacao_saldo', situacao_saldo);
    _.set(result, 'posicao_saldo', line.substr(169, 1));
    _.set(result, 'moeda', getIdTable('moeda', _.trim(line.substr(170, 3))));
    _.set(result, 'nro_sequencial', line.substr(173, 5));
    _.set(result, 'uso_banco_6', _.trim(line.substr(178, 62)));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord3 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params,
        ident_lancamento = _.trim(line.substr(14, 1)),
        agencia = line.substr(52, 5),
        conta_corrente = _.trim(line.substr(58, 12)),
        data_contabil = _.trim(line.substr(134, 8)),
        data_lancamento = line.substr(146, 4) + '-' + line.substr(144, 2) + '-' + line.substr(142, 2),
        valor_lancamento = (Number(line.substr(150, 18))/100),
        valor_saldo = valor_lancamento,
        tipo_lancamento = line.substr(168, 1),
        categoria_lancamento = _.trim(line.substr(169, 3)),
        desc_historico = _.toUpper(_.trim(line.substr(176, 25))),
        nro_documento = line.substr(201, 7),
        adquirente = { 'code': '', 'name': '' },
        ponto_venda = '', keyCommon = [],
        conciliationType = 'none';

    if (_.isEmpty(data_contabil) == false) {
        data_contabil = data_contabil.substr(4, 4) + '-' + data_contabil.substr(2, 2) + '-' + data_contabil.substr(0, 2);
    }
    if (tipo_lancamento == 'D') {
        valor_saldo = (-1 * valor_lancamento);
    }
    if ((categoria_lancamento == '202') && (ident_lancamento == '0')) {
        keyCommon.push('237');
        keyCommon.push(sizedField(agencia, 5));
        keyCommon.push(sizedField(conta_corrente, 15));
        keyCommon.push(data_lancamento);
        conciliationType = 'slip'
    }

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_keyCommon', _.join(keyCommon, '-'));
    _.set(result, '_conciliationType', conciliationType);
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'nr_sequencial', line.substr(8, 5));
    _.set(result, 'cod_segmento', line.substr(13, 1));
    _.set(result, 'ident_lancamento', getIdTable('ident_lancamento', ident_lancamento));
    _.set(result, 'uso_banco_1', _.trim(line.substr(15, 2)));
    _.set(result, 'tipo_inscricao', getIdTable('tipo_inscricao', _.trim(line.substr(17, 1))));
    _.set(result, 'nro_inscricao', line.substr(18, 14));
    _.set(result, 'cod_empresa', line.substr(32, 20));
    _.set(result, 'agencia', agencia);
    _.set(result, 'dig_agencia', line.substr(57, 1));
    _.set(result, 'conta_corrente', conta_corrente);
    _.set(result, 'dig_conta_corrente', line.substr(70, 1));
    _.set(result, 'dig_agencia_conta', _.trim(line.substr(71, 1)));
    _.set(result, 'nome_empresa', _.trim(line.substr(72, 30)));
    _.set(result, 'uso_banco_2', _.trim(line.substr(102, 6)));
    _.set(result, 'natureza_lancamento', getIdTable('natureza_lancamento', _.trim(line.substr(108, 3))));
    _.set(result, 'tipo_complemento', getIdTable('tipo_complemento', _.trim(line.substr(111, 2))));
    _.set(result, 'complemento', _.trim(line.substr(113, 20)));
    _.set(result, 'isento_cpmf', getIdTable('isento_cpmf', _.trim(line.substr(133, 1))));
    _.set(result, 'data_contabil', data_contabil);
    _.set(result, 'data_lancamento', data_lancamento);
    _.set(result, 'valor_lancamento', valor_lancamento);
    _.set(result, 'valor_saldo', valor_saldo);
    _.set(result, 'tipo_lancamento', tipo_lancamento);
    _.set(result, 'categoria_lancamento', getIdTable('categoria_lancamento', categoria_lancamento));
    _.set(result, 'cod_lancamento', _.trim(line.substr(172, 4)));
    _.set(result, 'desc_historico', desc_historico);
    _.set(result, 'nro_documento', nro_documento);
    _.set(result, 'segunda_linha', _.toUpper(_.trim(line.substr(208, 32))));
    _.set(result, 'adquirente', adquirente);
    _.set(result, 'ponto_venda', ponto_venda);
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_record3 += 1;
    if (ident_lancamento == '0') {
      params.totals.vl_record3 += valor_lancamento;
    }

    return result;
}

const parserRecord5 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params,
        limite_conta = (Number(line.substr(106, 18))/100),
        saldo_bloqueado = (Number(line.substr(124, 18))/100),
        valor_final = (Number(line.substr(150, 18))/100),
        valor_saldo = valor_final,
        situacao_saldo = line.substr(168, 1);

    if (situacao_saldo == 'D') {
        valor_saldo = (-1 * valor_final);
    }

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'uso_banco_1', _.trim(line.substr(8, 9)));
    _.set(result, 'tipo_inscricao', getIdTable('tipo_inscricao', _.trim(line.substr(17, 1))));
    _.set(result, 'nro_inscricao', line.substr(18, 14));
    _.set(result, 'cod_empresa', line.substr(32, 20));
    _.set(result, 'agencia', line.substr(52, 5));
    _.set(result, 'dig_agencia', line.substr(57, 1));
    _.set(result, 'conta_corrente', line.substr(58, 12));
    _.set(result, 'dig_conta_corrente', line.substr(70, 1));
    _.set(result, 'dig_agencia_conta', _.trim(line.substr(71, 1)));
    _.set(result, 'uso_banco_2', _.trim(line.substr(72, 16)));
    _.set(result, 'vinculado_dia_anterior', _.trim(line.substr(88, 16)));
    _.set(result, 'limite_conta', limite_conta);
    _.set(result, 'saldo_bloqueado', saldo_bloqueado);
    _.set(result, 'data_saldo', line.substr(146, 4) + '-' + line.substr(144, 2) + '-' + line.substr(142, 2));
    _.set(result, 'valor_final', valor_final);
    _.set(result, 'valor_saldo', valor_saldo);
    _.set(result, 'situacao_saldo', situacao_saldo);
    _.set(result, 'posicao_saldo', getIdTable('posicao_saldo', _.trim(line.substr(169, 1))));
    _.set(result, 'qt_registros_lote', Number(line.substr(170, 6)));
    _.set(result, 'somatorio_debito', Number(line.substr(176, 18))/100);
    _.set(result, 'somatorio_credito', Number(line.substr(194, 18))/100);
    _.set(result, 'uso_banco_3', _.trim(line.substr(212, 28)));
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_record5 += (result.qt_registros_lote - 2);
    params.totals.vl_record5 += (result.somatorio_debito + result.somatorio_credito);

    return result;
}

const parserRecord9 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'uso_banco_1', line.substr(8, 9));
    _.set(result, 'qt_lotes_arquivo', Number(line.substr(17, 6)));
    _.set(result, 'qt_registros_arquivo', Number(line.substr(23, 6)));
    _.set(result, 'qt_contas_conciliacao', Number(line.substr(29, 6)));
    _.set(result, 'uso_banco_2', line.substr(35, 205));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}


export const parser = async (params) => {
    return new Promise((resolve, reject ) => {
        try {
            let fullPath = _.get(params, 'fileInfo.FullPath', ''),
                fileId = _.get(params, 'fileInfo._id', ''),
                fileName = _.get(params, 'fileInfo.OriginalName', ''),
                fileKey = '';

            fs.readFile(fullPath, 'utf8', function(err, contents) {
                if (err) {
                    throw err;
                }

                let lines = contents.split('\n'),
                    totals = {
                        'qtd_record3': 0,
                        'qtd_record5': 0,
                        'vl_record3': 0,
                        'vl_record5': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(7, 1),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, totals, lineNumber };

                    if (type == '0') {
                        let temp = [];
                        const record00 = parserRecord0(args);
                        temp.push(_.get(record00, 'nro_sequencial', ''));
                        temp.push(_.get(record00, 'data_geracao', ''));
                        temp.push(_.get(record00, 'hora_geracao', ''));
                        fileKey = temp.join('');
                        parsed.push(record00);
                    } else if (type == '1') {
                        parsed.push(parserRecord1(args));
                    } else if (type == '3') {
                        parsed.push(parserRecord3(args));
                    } else if (type == '5') {
                        parsed.push(parserRecord5(args));
                    } else if (type == '9') {
                        parsed.push(parserRecord9(args));
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

export const validate = async (params) => {
    try {
        var errorMessage = '',
            difQuantity = _.round(params.totals.qtd_record3 - params.totals.qtd_record5, 2),
            difValues = _.round(params.totals.vl_record3 - params.totals.vl_record5, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Transações: ' + params.totals.qtd_record3 + ' Qt.Lotes: ' + params.totals.qtd_record5;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Transações: ' + _.round(params.totals.vl_record3, 2) + ' Vl.Lotes: ' + _.round(params.totals.vl_record5, 2) + ' Diferença: '+ difValues;
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
    const parsed = params.parsed,
          models = params.models;

    try {
        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  id = _.get(model, '_id', ''),
                  registro = _.get(model, 'registro', ''),
                  filter = { '_id': id };

            if (registro == '0') {
                await mongodb.cldr_bradesco_extrato_record0.upsert(filter, model);
            } else if (registro == '1') {
                await mongodb.cldr_bradesco_extrato_record1.upsert(filter, model);
            } else if (registro == '3') {
                await mongodb.cldr_bradesco_extrato_record3.upsert(filter, model);
            } else if (registro == '5') {
                await mongodb.cldr_bradesco_extrato_record5.upsert(filter, model);
            } else if (registro == '9') {
                await mongodb.cldr_bradesco_extrato_record9.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
