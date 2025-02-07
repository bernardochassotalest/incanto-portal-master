import _ from 'lodash'
import fs from 'fs'
import { md5, sizedField } from 'app/lib/utils'
import { mongodb } from 'app/models'
import { getIdTable } from 'app/jobs/skill/finance-files/itau/common/tables'
import { getPos } from 'app/jobs/skill/commons/utils'

const parserRecord0 = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'complemento1', _.trim(line.substr(8, 9)));
    _.set(result, 'tipo_inscricao', _.trim(line.substr(17, 1)));
    _.set(result, 'nro_inscricao', _.trim(line.substr(18, 14)));
    _.set(result, 'cod_empresa', _.trim(line.substr(32, 13)));
    _.set(result, 'complemento2', _.trim(line.substr(45, 7)));
    _.set(result, 'complemento3', _.trim(line.substr(52, 1)));
    _.set(result, 'agencia', _.trim(line.substr(53, 4)));
    _.set(result, 'complemento4', _.trim(line.substr(57, 1)));
    _.set(result, 'complemento5', _.trim(line.substr(58, 7)));
    _.set(result, 'conta_corrente', _.trim(line.substr(65, 5)));
    _.set(result, 'complemento6', _.trim(line.substr(70, 1)));
    _.set(result, 'dig_conta_corrente', _.trim(line.substr(71, 1)));
    _.set(result, 'nome_empresa', _.trim(line.substr(72, 30)));
    _.set(result, 'nome_banco', _.trim(line.substr(102, 30)));
    _.set(result, 'complemento7', _.trim(line.substr(132, 10)));
    _.set(result, 'cod_retorno', _.trim(line.substr(142, 1)));
    _.set(result, 'data_geracao', line.substr(143, 8));
    _.set(result, 'hora_geracao', line.substr(151, 6));
    _.set(result, 'nro_sequencial', _.trim(line.substr(157, 6)));
    _.set(result, 'nro_versao', _.trim(line.substr(163, 3)));
    _.set(result, 'densidade', _.trim(line.substr(166, 5)));
    _.set(result, 'reservado', _.trim(line.substr(171, 20)));
    _.set(result, 'complemento8', _.trim(line.substr(191, 49)));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord1 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'tipo_operacao', _.trim(line.substr(8, 1)));
    _.set(result, 'tipo_servico', _.trim(line.substr(9, 2)));
    _.set(result, 'forma_lancamento', _.trim(line.substr(11, 2)));
    _.set(result, 'nro_versao', _.trim(line.substr(13, 3)));
    _.set(result, 'complemento1', _.trim(line.substr(16, 1)));
    _.set(result, 'tipo_inscricao', _.trim(line.substr(17, 1)));
    _.set(result, 'nro_inscricao', _.trim(line.substr(18, 14)));
    _.set(result, 'cod_empresa', _.trim(line.substr(32, 13)));
    _.set(result, 'complemento2', _.trim(line.substr(45, 7)));
    _.set(result, 'complemento3', _.trim(line.substr(52, 1)));
    _.set(result, 'agencia', _.trim(line.substr(53, 4)));
    _.set(result, 'complemento4', _.trim(line.substr(57, 1)));
    _.set(result, 'complemento5', _.trim(line.substr(58, 7)));
    _.set(result, 'conta_corrente', _.trim(line.substr(65, 5)));
    _.set(result, 'complemento6', _.trim(line.substr(70, 1)));
    _.set(result, 'dig_conta_corrente', line.substr(71, 1));
    _.set(result, 'nome_empresa', _.trim(line.substr(72, 30)));
    _.set(result, 'complemento7', _.trim(line.substr(102, 40)));
    _.set(result, 'endereco_empresa', _.trim(line.substr(142, 30)));
    _.set(result, 'nro_empresa', _.trim(line.substr(172, 5)));
    _.set(result, 'complemento_empresa', _.trim(line.substr(177, 15)));
    _.set(result, 'cidade_empresa', _.trim(line.substr(192, 20)));
    _.set(result, 'cep_empresa', _.trim(line.substr(212, 8)));
    _.set(result, 'estado_empresa', _.trim(line.substr(220, 2)));
    _.set(result, 'complemento8', _.trim(line.substr(222, 8)));
    _.set(result, 'ocorrencias', _.trim(line.substr(230, 10)));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const getKeys = (model, companyCode, posConfig) => {
    let result = { 'Tag': 'sep' },
        dtPaga = _.replace(_.get(model, 'data_cobrada', ''), /\-/ig, ''),
        keyDebitNumber = [],
        keyOurNumber = [],
        keySettlement = [];

    let mapping = getPos(posConfig, 'itau', companyCode);
    if (_.isEmpty(mapping) == false) {
        _.set(result, 'Bank', mapping.Bank);
        _.set(result, 'Branch', mapping.Branch);
        _.set(result, 'Account', mapping.Account);
        _.set(result, 'DigitAcct', mapping.DigitAccount);

        keyDebitNumber.push('341')
        keyDebitNumber.push(sizedField(mapping.Branch, 5));
        keyDebitNumber.push(sizedField(mapping.Account, 10));
        keyDebitNumber.push(sizedField(model.nro_documento, 15));
        _.set(result, 'DebitNumber', _.join(keyDebitNumber, '-'));

        keyOurNumber.push('341')
        keyOurNumber.push(sizedField(mapping.Branch, 5));
        keyOurNumber.push(sizedField(mapping.Account, 10));
        keyOurNumber.push(sizedField(model.nosso_numero, 20));
        _.set(result, 'OurNumber', _.join(keyOurNumber, '-'));

        if (_.toNumber(dtPaga) > 0) {
          keySettlement.push(sizedField(mapping.Bank, 3));
          keySettlement.push(sizedField(mapping.Branch, 5));
          keySettlement.push(sizedField(mapping.Account, 10));
          keySettlement.push(`${dtPaga}00`);
          _.set(result, 'Settlement', _.join(keySettlement, '-'));
        }
        _.set(result, 'Tag', mapping.Tag);
    }

    return result;
}

const parserRecord3 = (params) => {
    let result = {},
        { line, fileKey, lineNumber, companyCode, dataArquivo, posConfig } = params,
        valor_agendado = (Number(line.substr(119, 15))/100),
        valor_cobrado = (Number(line.substr(162, 15))/100);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_keys', '');
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'nr_sequencial', line.substr(8, 5));
    _.set(result, 'tag', 'sep');
    _.set(result, 'cod_segmento', _.trim(line.substr(13, 1)));
    _.set(result, 'cod_instrucao', getIdTable('cod_instrucao', _.trim(line.substr(14, 3))));
    _.set(result, 'compensacao', _.trim(line.substr(17, 3)));
    _.set(result, 'banco_debitado', _.trim(line.substr(20, 3)));
    _.set(result, 'complemento1', _.trim(line.substr(23, 1)));
    _.set(result, 'agencia_debitada', line.substr(24, 4));
    _.set(result, 'complemento2', _.trim(line.substr(28, 1)));
    _.set(result, 'complemento3', _.trim(line.substr(29, 7)));
    _.set(result, 'conta_debitada', _.trim(line.substr(36, 5)));
    _.set(result, 'dig_conta_debitada', _.trim(line.substr(42, 1)));
    _.set(result, 'nome_debitado', _.trim(line.substr(43, 30)));
    _.set(result, 'nro_documento', _.trim(line.substr(73, 15)));
    _.set(result, 'complemento4', _.trim(line.substr(88, 5)));
    _.set(result, 'data_arquivo', dataArquivo);
    _.set(result, 'data_agendada', line.substr(97, 4) + '-' + line.substr(95, 2) + '-' + line.substr(93, 2));
    _.set(result, 'tipo_moeda', getIdTable('tipo_moeda', _.trim(line.substr(101, 3))));
    _.set(result, 'qtd_moeda', (Number(line.substr(104, 15))/100000));
    _.set(result, 'valor_agendado', valor_agendado);
    _.set(result, 'nosso_numero', _.trim(line.substr(134, 20)));
    _.set(result, 'data_cobrada', line.substr(158, 4) + '-' + line.substr(156, 2) + '-' + line.substr(154, 2));
    _.set(result, 'valor_cobrado', valor_cobrado);
    _.set(result, 'tipo_mora', getIdTable('tipo_mora', _.trim(line.substr(177, 2))));
    _.set(result, 'valor_mora', (Number(line.substr(179, 17))/100));
    _.set(result, 'historico', _.trim(line.substr(196, 16)));
    _.set(result, 'complemento5', _.trim(line.substr(212, 4)));
    _.set(result, 'nro_inscricao', _.trim(line.substr(216, 14)));
    _.set(result, 'ocorrencia1', getIdTable('ocorrencia_debito_240', _.trim(line.substr(230, 2))));
    _.set(result, 'ocorrencia2', getIdTable('ocorrencia_debito_240', _.trim(line.substr(232, 2))));
    _.set(result, 'ocorrencia3', getIdTable('ocorrencia_debito_240', _.trim(line.substr(234, 2))));
    _.set(result, 'ocorrencia4', getIdTable('ocorrencia_debito_240', _.trim(line.substr(236, 2))));
    _.set(result, 'ocorrencia5', getIdTable('ocorrencia_debito_240', _.trim(line.substr(238, 2))));
    _.set(result, 'id_arquivo', params.fileId);

    let keys = getKeys(result, companyCode, posConfig);
    _.set(result, '_keys', keys);
    _.set(result, 'tag', _.get(keys, 'Tag', ''));

    params.totals.qtd_record3 += 1;
    params.totals.vl_record3 += valor_agendado;

    return result;
}

const parserRecord5 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'banco', line.substr(0, 3));
    _.set(result, 'lote', line.substr(3, 4));
    _.set(result, 'registro', line.substr(7, 1));
    _.set(result, 'complemento1', _.trim(line.substr(8, 9)));
    _.set(result, 'qt_registros_lote', Number(line.substr(17, 6)));
    _.set(result, 'somatorio_debito', Number(line.substr(23, 18))/100);
    _.set(result, 'somatorio_moedas', Number(line.substr(41, 18))/100000);
    _.set(result, 'complemento2', _.trim(line.substr(59, 171)));
    _.set(result, 'ocorrencias', _.trim(line.substr(230, 10)));
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_record5 += (result.qt_registros_lote - 2);
    params.totals.vl_record5 += result.somatorio_debito;

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
    _.set(result, 'complemento1', _.trim(line.substr(8, 9)));
    _.set(result, 'qt_lotes_arquivo', Number(line.substr(17, 6)));
    _.set(result, 'qt_registros_arquivo', Number(line.substr(23, 6)));
    _.set(result, 'complemento2', _.trim(line.substr(29, 211)));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}


export const parser = async (params) => {
    return new Promise((resolve, reject ) => {
        try {
            let fullPath = _.get(params, 'fileInfo.FullPath', ''),
                fileId = _.get(params, 'fileInfo._id', ''),
                fileName = _.get(params, 'fileInfo.OriginalName', ''),
                fileKey = '', companyCode = '', dataArquivo = '';

            fs.readFile(fullPath, 'utf8', async function(err, contents) {
                if (err) {
                    throw err;
                }

                let posConfig = await mongodb.cldr_pos_config.loadAll();
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
                        args = { line, fileId, fileKey, companyCode, dataArquivo, totals, lineNumber, posConfig };

                    if (type == '0') {
                        let temp = [];
                        const record00 = parserRecord0(args);
                        temp.push(_.get(record00, 'nro_sequencial', ''));
                        temp.push(_.get(record00, 'data_geracao', ''));
                        temp.push(_.get(record00, 'hora_geracao', ''));
                        fileKey = temp.join('');
                        companyCode = _.get(record00, 'cod_empresa', '');
                        dataArquivo = _.get(record00, 'data_geracao', '');
                        dataArquivo = dataArquivo.substr(4, 4) + '-' + dataArquivo.substr(2, 2) + '-' + dataArquivo.substr(0, 2);
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
                await mongodb.cldr_itau_debito_record0.upsert(filter, model);
            } else if (registro == '1') {
                await mongodb.cldr_itau_debito_record1.upsert(filter, model);
            } else if (registro == '3') {
                await mongodb.cldr_itau_debito_record3.upsert(filter, model);
            } else if (registro == '5') {
                await mongodb.cldr_itau_debito_record5.upsert(filter, model);
            } else if (registro == '9') {
                await mongodb.cldr_itau_debito_record9.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
