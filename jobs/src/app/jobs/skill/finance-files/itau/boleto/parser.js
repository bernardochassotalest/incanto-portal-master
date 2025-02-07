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
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'cod_retorno', line.substr(1, 1));
    _.set(result, 'tipo_movimento', line.substr(2, 7));
    _.set(result, 'cod_servico', line.substr(9, 2));
    _.set(result, 'tipo_servico', _.trim(line.substr(11, 15)));
    _.set(result, 'agencia', line.substr(26, 4));
    _.set(result, 'complemento1', _.trim(line.substr(30, 2)));
    _.set(result, 'conta_corrente', line.substr(32, 5));
    _.set(result, 'dig_conta_corrente', line.substr(37, 1));
    _.set(result, 'complemento2', _.trim(line.substr(38, 8)));
    _.set(result, 'nome_empresa', _.trim(line.substr(46, 30)));
    _.set(result, 'cod_banco', line.substr(76, 3));
    _.set(result, 'nome_banco', _.trim(line.substr(79, 15)));
    _.set(result, 'data_geracao', '20' + line.substr(98, 2) + '-' + line.substr(96, 2) + '-' + line.substr(94, 2));
    _.set(result, 'densidade1', line.substr(100, 5));
    _.set(result, 'densidade2', line.substr(105, 3));
    _.set(result, 'nro_arquivo', line.substr(108, 5));
    _.set(result, 'data_credito', '20' + line.substr(117, 2) + '-' + line.substr(115, 2) + '-' + line.substr(113, 2));
    _.set(result, 'complemento3', _.trim(line.substr(119, 275)));
    _.set(result, 'nro_sequencial', line.substr(394, 6));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const getKeys = (model, posConfig) => {
    let result = { 'Tag': 'sep' },
        keyOurNumber = [],
        keyAccount = [],
        occurId = _.get(model, 'ocorrencia.code', ''),
        isFee = _.includes(['51','52','53','54','55'], occurId);

    keyOurNumber.push('341')
    keyOurNumber.push(sizedField(model.agencia, 5));
    keyOurNumber.push(sizedField(model.conta_corrente, 10));
    if (isFee == true) {
      keyOurNumber.push(sizedField(model.nro_documento, 15));
    } else {
      keyOurNumber.push(sizedField(model.nosso_numero, 15));
    }
    _.set(result, 'OurNumber', _.join(keyOurNumber, '-'));

    keyAccount.push('341')
    keyAccount.push(sizedField(model.agencia, 5));
    keyAccount.push(sizedField(model.conta_corrente, 10));
    _.set(result, 'Account', _.join(keyAccount, '-'));

    let mapping = getPos(posConfig, 'itau', result.Account);
    if (_.isEmpty(mapping) == false) {
        let keySettlement = [];
        keySettlement.push(sizedField(mapping.Bank, 3));
        keySettlement.push(sizedField(mapping.Branch, 5));
        keySettlement.push(sizedField(mapping.Account, 10));
        if (isFee == true) {
          keySettlement.push(model.dt_ocorrencia);
        } else {
          keySettlement.push(model.dt_credito);
        }
        _.set(result, 'Settlement', _.join(keySettlement, '-'));
        _.set(result, 'Tag', mapping.Tag);
    }

    return result;
}

const parserRecord1 = (params) => {
    let result = {},
        { line, fileKey, lineNumber, posConfig } = params,
        dtCredito = _.trim(line.substr(295, 6));

    if (_.isEmpty(dtCredito) == false) {
    	dtCredito = '20' + dtCredito.substr(4, 2) + '-' + dtCredito.substr(2, 2) + '-' + dtCredito.substr(0, 2)
    }
    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_keys', '');
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'tipo_inscricao', getIdTable('tipo_inscricao', _.trim(line.substr(1, 2))));
    _.set(result, 'nro_inscricao', line.substr(3, 14));
    _.set(result, 'agencia', line.substr(17, 4));
    _.set(result, 'complemento1', _.trim(line.substr(21, 2)));
    _.set(result, 'conta_corrente', line.substr(23, 5));
    _.set(result, 'dig_conta_corrente', line.substr(28, 1));
    _.set(result, 'tag', 'sep');
    _.set(result, 'complemento2', _.trim(line.substr(29, 8)));
    _.set(result, 'nro_titulo', _.trim(line.substr(37, 25)));
    _.set(result, 'nro_tit_banco', _.trim(line.substr(62, 8)));
    _.set(result, 'complemento3', _.trim(line.substr(70, 12)));
    _.set(result, 'nro_carteira', line.substr(82, 3));
    _.set(result, 'nosso_numero', line.substr(85, 8));
    _.set(result, 'dig_nosso_numero', line.substr(93, 1));
    _.set(result, 'complemento4', _.trim(line.substr(94, 13)));
    _.set(result, 'cod_carteira', line.substr(107, 1));
    _.set(result, 'ocorrencia', getIdTable('tipo_ocorrencia', _.trim(line.substr(108, 2))));
    _.set(result, 'dt_ocorrencia', '20' + line.substr(114, 2) + '-' + line.substr(112, 2) + '-' + line.substr(110, 2));
    _.set(result, 'nro_documento', _.trim(line.substr(116, 10)));
    _.set(result, 'conf_nosso_nro', line.substr(126, 8));
    _.set(result, 'complemento5', _.trim(line.substr(134, 12)));
    _.set(result, 'dt_vencimento', '20' + line.substr(150, 2) + '-' + line.substr(148, 2) + '-' + line.substr(146, 2));
    _.set(result, 'vl_titulo', _.toNumber(line.substr(152, 13)) / 100)
    _.set(result, 'banco_cobrador', line.substr(165, 3));
    _.set(result, 'ag_cobradora', line.substr(168, 4));
    _.set(result, 'dac_ag_cobradora', line.substr(172, 1));
    _.set(result, 'especie_titulo', getIdTable('especie_titulo', _.trim(line.substr(173, 2))));
    _.set(result, 'vl_tarifa', _.toNumber(line.substr(175, 13)) / 100)
    _.set(result, 'complemento6', _.trim(line.substr(188, 26)));
    _.set(result, 'vl_iof', _.toNumber(line.substr(214, 13)) / 100)
    _.set(result, 'vl_abatimento', _.toNumber(line.substr(227, 13)) / 100)
    _.set(result, 'vl_desconto', _.toNumber(line.substr(240, 13)) / 100)
    _.set(result, 'vl_pago', _.toNumber(line.substr(253, 13)) / 100)
    _.set(result, 'vl_juros', _.toNumber(line.substr(266, 13)) / 100)
    _.set(result, 'vl_outros_creditos', _.toNumber(line.substr(279, 13)) / 100)
    _.set(result, 'ind_dda', getIdTable('tipo_dda', _.trim(line.substr(292, 1))));
    _.set(result, 'complemento7', _.trim(line.substr(293, 2)));
    _.set(result, 'dt_credito', dtCredito);
    _.set(result, 'instrucao_cancelada', line.substr(301, 4));
    _.set(result, 'complemento8', _.trim(line.substr(305, 6)));
    _.set(result, 'complemento9', _.trim(line.substr(311, 13)));
    _.set(result, 'nome_pagador', _.trim(line.substr(324, 30)));
    _.set(result, 'complemento10', _.trim(line.substr(354, 23)));
    _.set(result, 'erros', _.trim(line.substr(377, 8)));
    _.set(result, 'complemento11', _.trim(line.substr(385, 7)));
    _.set(result, 'tipo_liquidacao', getIdTable('tipo_liquidacao', _.trim(line.substr(392, 2))));
    _.set(result, 'nro_sequencial', line.substr(394, 6));
    _.set(result, 'id_arquivo', params.fileId);

    let keys = getKeys(result, posConfig);
    _.set(result, '_keys', keys);
    _.set(result, 'tag', _.get(keys, 'Tag', ''));

    params.totals.qtd_record1 += 1;
    params.totals.vl_record1 += result.vl_titulo;

    return result;
}

const parserRecord9 = (params) => {
    let result = {},
        { line, fileKey, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'cod_retorno', line.substr(1, 1));
    _.set(result, 'tipo_servico', line.substr(2, 2));
    _.set(result, 'cod_banco', line.substr(4, 3));
    _.set(result, 'complemento1', _.trim(line.substr(7, 10)));
    _.set(result, 'qt_cobr_simples', _.toNumber(line.substr(17, 8)));
    _.set(result, 'vl_cobr_simples', _.toNumber(line.substr(25, 14)) / 100)
    _.set(result, 'aviso_bancario1', _.trim(line.substr(39, 8)));
    _.set(result, 'complemento2', _.trim(line.substr(47, 10)));
    _.set(result, 'qt_cobr_vinculada', _.toNumber(line.substr(57, 8)));
    _.set(result, 'vl_cobr_vinculada', _.toNumber(line.substr(67, 14)) / 100)
    _.set(result, 'aviso_bancario2', _.trim(line.substr(79, 8)));
    _.set(result, 'complemento3', _.trim(line.substr(87, 90)));
    _.set(result, 'qt_cobr_escritural', _.toNumber(line.substr(177, 8)));
    _.set(result, 'vl_cobr_escritural', _.toNumber(line.substr(185, 14)) / 100)
    _.set(result, 'aviso_bancario3', _.trim(line.substr(199, 8)));
    _.set(result, 'nro_arquivo', line.substr(207, 5));
    _.set(result, 'qt_titulos', _.toNumber(line.substr(212, 8)));
    _.set(result, 'vl_titulos', _.toNumber(line.substr(220, 14)) / 100)
    _.set(result, 'complemento4', _.trim(line.substr(234, 160)));
    _.set(result, 'nro_sequencial', line.substr(394, 6));
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_record9 += result.qt_titulos;
    params.totals.vl_record9 += result.vl_titulos;

    return result;
}

export const parser = async (params) => {
    return new Promise((resolve, reject) => {
        try {
            let fullPath = _.get(params, 'fileInfo.FullPath', ''),
                fileId = _.get(params, 'fileInfo._id', ''),
                fileName = _.get(params, 'fileInfo.OriginalName', ''),
                fileKey = '';

            fs.readFile(fullPath, 'utf8', async function(err, contents) {
                if (err) {
                    throw err;
                }

                let posConfig = await mongodb.cldr_pos_config.loadAll();
                let lines = contents.split('\n'),
                    totals = {
                        'qtd_record1': 0,
                        'qtd_record9': 0,
                        'vl_record1': 0,
                        'vl_record9': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 1),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, totals, lineNumber, posConfig };

                    if (type == '0') {
                        let temp = [];
                        const record00 = parserRecord0(args);
                        temp.push(_.get(record00, 'nro_arquivo', ''));
                        temp.push(_.get(record00, 'data_geracao', ''));
                        fileKey = temp.join('');
                        parsed.push(record00);
                    } else if (type == '1') {
                        parsed.push(parserRecord1(args));
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
            return reject(error);
        }
    })
}

export const validate = async (params) => {
    try {
        var errorMessage = '',
            difQuantity = _.round(params.totals.qtd_record1 - params.totals.qtd_record9, 2),
            difValues = _.round(params.totals.vl_record1 - params.totals.vl_record9, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Boletos: ' + params.totals.qtd_record1 + ' Qt.Arquivo: ' + params.totals.qtd_record9;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Boletos: ' + _.round(params.totals.vl_record1, 2) + ' Vl.Arquivo: ' + _.round(params.totals.vl_record9, 2) + ' Diferença: '+ difValues;
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
                await mongodb.cldr_itau_boleto_record0.upsert(filter, model);
            } else if (registro == '1') {
                await mongodb.cldr_itau_boleto_record1.upsert(filter, model);
            } else if (registro == '9') {
                await mongodb.cldr_itau_boleto_record9.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
