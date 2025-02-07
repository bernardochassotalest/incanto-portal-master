import _ from 'lodash'
import fs from 'fs'
import { md5, sizedField } from 'app/lib/utils'
import { mongodb } from 'app/models'
import { getIdTable } from 'app/jobs/skill/finance-files/itau/common/tables'
import { getPos } from 'app/jobs/skill/commons/utils'

const parserRecordA = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'cod_retorno', line.substr(1, 1));
    _.set(result, 'cod_empresa', _.trim(line.substr(2, 13)));
    _.set(result, 'complemento1', _.trim(line.substr(15, 7)));
    _.set(result, 'nome_empresa', _.trim(line.substr(22, 20)));
    _.set(result, 'banco', line.substr(42, 3));
    _.set(result, 'nome_banco', _.trim(line.substr(45, 10)));
    _.set(result, 'complemento2', _.trim(line.substr(55, 10)));
    _.set(result, 'data_geracao', line.substr(65, 8));
    _.set(result, 'nro_sequencial', _.trim(line.substr(73, 6)));
    _.set(result, 'nro_versao', _.trim(line.substr(79, 2)));
    _.set(result, 'servico', _.trim(line.substr(81, 17)));
    _.set(result, 'complemento3', _.trim(line.substr(98, 52)));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecordB = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'cod_cliente', _.trim(line.substr(1, 25)));
    _.set(result, 'agencia', _.trim(line.substr(26, 4)));
    _.set(result, 'complemento1', _.trim(line.substr(30, 8)));
    _.set(result, 'conta_corrente', _.trim(line.substr(38, 5)));
    _.set(result, 'dig_conta_corrente', _.trim(line.substr(43, 1)));
    _.set(result, 'data_opcao', line.substr(44, 4) + '-' + line.substr(48, 2) + '-' + line.substr(50, 2));
    _.set(result, 'complemento2', _.trim(line.substr(52, 97)));
    _.set(result, 'cod_movimento', getIdTable('cod_movimento', _.trim(line.substr(149, 1))));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const getKeys = (model, companyCode, posConfig) => {
    let result = { 'Tag': 'sep' },
        keyDebitNumber = [],
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
        keyDebitNumber.push(sizedField(model.nro_documento, 25));
        _.set(result, 'DebitNumber', _.join(keyDebitNumber, '-'));

        keySettlement.push(sizedField(mapping.Bank, 3));
        keySettlement.push(sizedField(mapping.Branch, 5));
        keySettlement.push(sizedField(mapping.Account, 10));
        keySettlement.push(model.data_lancamento);
        _.set(result, 'Settlement', _.join(keySettlement, '-'));
        _.set(result, 'Tag', mapping.Tag);
    }

    return result;
}

const parserRecordF = (params) => {
    let result = {},
        { line, lineNumber, companyCode, posConfig } = params,
        valor_lancado = (Number(line.substr(52, 15))/100);

    _.set(result, '_id', md5(line));
    _.set(result, '_keys', '');
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'tag', 'sep');
    _.set(result, 'cod_cliente', _.trim(line.substr(1, 25)));
    _.set(result, 'agencia', _.trim(line.substr(26, 4)));
    _.set(result, 'complemento1', _.trim(line.substr(30, 8)));
    _.set(result, 'conta_corrente', _.trim(line.substr(38, 5)));
    _.set(result, 'dig_conta_corrente', _.trim(line.substr(43, 1)));
    _.set(result, 'data_lancamento', line.substr(44, 4) + '-' + line.substr(48, 2) + '-' + line.substr(50, 2));
    _.set(result, 'valor_lancado', valor_lancado);
    _.set(result, 'ocorrencia', getIdTable('ocorrencia_debito_150', _.trim(line.substr(67, 2))));
    _.set(result, 'nro_documento', _.trim(line.substr(69, 25)));
    _.set(result, 'valor_mora', (Number(line.substr(94, 15))/100));
    _.set(result, 'complemento2', _.trim(line.substr(109, 26)));
    _.set(result, 'nro_inscricao', _.trim(line.substr(135, 14)));
    _.set(result, 'cod_movimento', getIdTable('cod_movimento', _.trim(line.substr(149, 1))));
    _.set(result, 'id_arquivo', params.fileId);

    let keys = getKeys(result, companyCode, posConfig);
    _.set(result, '_keys', keys);
    _.set(result, 'tag', _.get(keys, 'Tag', ''));

    params.totals.qtd_recordF += 1;
    params.totals.vl_recordF += valor_lancado;

    return result;
}

const parserRecordH = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'cod_cliente', _.trim(line.substr(1, 25)));
    _.set(result, 'agencia', _.trim(line.substr(26, 4)));
    _.set(result, 'complemento1', _.trim(line.substr(30, 8)));
    _.set(result, 'conta_corrente', _.trim(line.substr(38, 5)));
    _.set(result, 'dig_conta_corrente', _.trim(line.substr(43, 1)));
    _.set(result, 'novo_codigo', _.trim(line.substr(44, 25)));
    _.set(result, 'ocorrencia', getIdTable('ocorrencia_debito_150', _.trim(line.substr(69, 2))));
    _.set(result, 'complemento2', _.trim(line.substr(71, 56)));
    _.set(result, 'complemento3', _.trim(line.substr(127, 22)));
    _.set(result, 'cod_movimento', getIdTable('cod_movimento', _.trim(line.substr(149, 1))));
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecordZ = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber);
    _.set(result, 'registro', line.substr(0, 1));
    _.set(result, 'qt_registros', Number(line.substr(1, 6)));
    _.set(result, 'vl_total_debitos', (Number(line.substr(7, 17))/100));
    _.set(result, 'complemento1', _.trim(line.substr(24, 126)));
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_recordZ += (result.qt_registros - 2);
    params.totals.vl_recordZ += result.vl_total_debitos;

    return result;
}

export const parser = async (params) => {
    return new Promise((resolve, reject ) => {
        try {
            let fullPath = _.get(params, 'fileInfo.FullPath', ''),
                fileId = _.get(params, 'fileInfo._id', ''),
                fileName = _.get(params, 'fileInfo.OriginalName', ''),
                fileKey = '', companyCode = '';

            fs.readFile(fullPath, 'utf8', async function(err, contents) {
                if (err) {
                    throw err;
                }

                let posConfig = await mongodb.cldr_pos_config.loadAll();
                let lines = contents.split('\n'),
                    totals = {
                        'qtd_recordF': 0,
                        'qtd_recordZ': 0,
                        'vl_recordF': 0,
                        'vl_recordZ': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 1),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, companyCode, totals, lineNumber, posConfig };

                    if (type == 'A') {
                        let temp = [];
                        const recordA = parserRecordA(args);
                        temp.push(_.get(recordA, 'nro_sequencial', ''));
                        temp.push(_.get(recordA, 'data_geracao', ''));
                        fileKey = temp.join('');
                        companyCode = _.get(recordA, 'cod_empresa', '');
                        parsed.push(recordA);
                    } else if (type == 'B') {
                        parsed.push(parserRecordB(args));
                    } else if (type == 'F') {
                        parsed.push(parserRecordF(args));
                    } else if (type == 'H') {
                        parsed.push(parserRecordH(args));
                    } else if (type == 'Z') {
                        parsed.push(parserRecordZ(args));
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
            difQuantity = _.round(params.totals.qtd_recordF - params.totals.qtd_recordZ, 2),
            difValues = _.round(params.totals.vl_recordF - params.totals.vl_recordZ, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Transações: ' + params.totals.qtd_recordF + ' Qt.Lotes: ' + params.totals.qtd_recordZ;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Transações: ' + _.round(params.totals.vl_recordF, 2) + ' Vl.Lotes: ' + _.round(params.totals.vl_recordZ, 2) + ' Diferença: '+ difValues;
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

            if (registro == 'A') {
                await mongodb.cldr_itau_debito_recordA.upsert(filter, model);
            } else if (registro == 'B') {
                await mongodb.cldr_itau_debito_recordB.upsert(filter, model);
            } else if (registro == 'F') {
                await mongodb.cldr_itau_debito_recordF.upsert(filter, model);
            } else if (registro == 'H') {
                await mongodb.cldr_itau_debito_recordH.upsert(filter, model);
            } else if (registro == 'Z') {
                await mongodb.cldr_itau_debito_recordZ.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
