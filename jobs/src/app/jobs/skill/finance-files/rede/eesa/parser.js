import _ from 'lodash'
import fs from 'fs'
import { mongodb } from 'app/models'
import { md5, sizedField } from 'app/lib/utils'
import { getTag } from 'app/jobs/skill/commons/utils'
import { getIdTable } from 'app/jobs/skill/finance-files/rede/common/tables'

const parserRecord060 = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'dt_emissao', line.substr(7, 4) + '-' + line.substr(5, 2) + '-' + line.substr(3, 2))
    _.set(result, 'info_01', _.trim(line.substr(11, 8)))
    _.set(result, 'info_02', _.trim(line.substr(19, 40)))
    _.set(result, 'nome_comercial', _.trim(line.substr(59, 22)))
    _.set(result, 'nro_sequencial', line.substr(81, 6))
    _.set(result, 'nro_pv_matriz', line.substr(87, 9))
    _.set(result, 'tipo_processamento', _.trim(line.substr(96, 15)))
    _.set(result, 'versao_arquivo', _.trim(line.substr(111, 20)))
    _.set(result, 'id_arquivo', params.fileId);
    params.totals.qtd_record062 += 1;

    return result;
}

const parserRecord061 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv_matriz', _.trim(line.substr(3, 9)))
    _.set(result, 'nome_comercial', _.trim(line.substr(12, 22)))
    _.set(result, 'id_arquivo', params.fileId);
    params.totals.qtd_record062 += 1;

    return result;
}

const parserRecord062 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_parcela = line.substr(159, 2),
        nro_pv = line.substr(150, 9),
        tipo_plano = (_.toNumber(nro_parcela) > 0 ? 'parcelado' : 'rotativo');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tipo_plano', tipo_plano)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_ordem_credito', line.substr(3, 15))
    _.set(result, 'tipo_ajuste', getIdTable(fileType, 'tipo_ajuste', line.substr(18, 1)))
    _.set(result, 'banco', line.substr(19, 3))
    _.set(result, 'agencia', line.substr(22, 9))
    _.set(result, 'conta_corrente', line.substr(31, 11))
    _.set(result, 'dt_vencimento', line.substr(46, 4) + '-' + line.substr(44, 2) + '-' + line.substr(42, 2))
    _.set(result, 'estabelecimento', line.substr(50, 9))
    _.set(result, 'microfilme', line.substr(59, 13))
    _.set(result, 'nro_rv', line.substr(72, 9))
    _.set(result, 'data_rv', line.substr(85, 4) + '-' + line.substr(83, 2) + '-' + line.substr(81, 2))
    _.set(result, 'status_credito', getIdTable(fileType, 'status_credito', '0' + line.substr(89, 1)))
    _.set(result, 'vl_bruto', Number(line.substr(90, 15)) / 100)
    _.set(result, 'vl_desconto', Number(line.substr(105, 15)) / 100)
    _.set(result, 'vl_gorjeta', Number(line.substr(120, 15)) / 100)
    _.set(result, 'vl_liquido', Number(line.substr(135, 15)) / 100)
    _.set(result, 'taxa_administracao', 0)
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_parcela', nro_parcela)
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', line.substr(161, 1)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'data_rv', '') + '-' + _.get(result, 'nro_rv', ''))

    params.totals.qtd_record062 += 1;
    params.totals.vl_record062 += result.vl_liquido;

    let vl_bruto = _.get(result, 'vl_bruto', 0),
        vl_desconto = _.get(result, 'vl_desconto', 0),
        vl_liquido = _.get(result, 'vl_liquido', 0),
        taxa_administracao = _.round(((vl_desconto/vl_bruto) * 100), 2);
    if (_.isNaN(taxa_administracao) == true) {
        taxa_administracao = 0;
    }
    result['taxa_administracao'] = taxa_administracao;

    return result;
}

const parserRecord066 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv_matriz', line.substr(3, 9))
    _.set(result, 'qtd_total_resumos', Number(line.substr(12, 5)))
    _.set(result, 'vl_total_liquido', Number(line.substr(17, 15)) / 100)
    _.set(result, 'id_arquivo', params.fileId);
    params.totals.qtd_record062 += 1;

    return result;
}

const parserRecord068 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'registro', line.substr(0, 3))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'qtd_matrizes', Number(line.substr(3, 4)))
    _.set(result, 'qtd_registros', Number(line.substr(7, 5)))
    _.set(result, 'nro_pv_grupo', line.substr(12, 9))
    _.set(result, 'vl_total_liquido', Number(line.substr(21, 15)) / 100)
    _.set(result, 'id_arquivo', params.fileId);

    params.totals.qtd_record062 += 1;
    params.totals.qtd_record068 += (result.qtd_registros);
    params.totals.vl_record068 += (result.vl_total_liquido);

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
                        'qtd_record062': 0,
                        'qtd_record068': 0,
                        'vl_record062': 0,
                        'vl_record068': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 3),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, fileType, totals, lineNumber, tags };

                    if (type == '060') {
                        let temp = [];
                        const record060 = parserRecord060(args);
                        temp.push(_.get(record060, 'nro_sequencial', ''));
                        temp.push(_.get(record060, 'dt_emissao', ''));
                        temp.push(_.get(record060, 'tipo_processamento', ''));
                        fileKey = temp.join('');
                        parsed.push(record060);
                    } else if (type == '061') {
                        parsed.push(parserRecord061(args));
                    } else if (type == '062') {
                        parsed.push(parserRecord062(args));
                    } else if (type == '066') {
                        parsed.push(parserRecord066(args));
                    } else if (type == '068') {
                        parsed.push(parserRecord068(args));
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
        var error = null,
            errorMessage = '',
            difQuantity = _.round(params.totals.qtd_record062 - params.totals.qtd_record068, 2),
            difValues = _.round(params.totals.vl_record062 - params.totals.vl_record068, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Resumos: ' + params.totals.qtd_record062 + ' Qt.Arquivo: ' + params.totals.qtd_record068;
        }
        // if (difValues != 0) {
        //     errorMessage += ' Vl.Resumos: ' + _.round(params.totals.vl_record062, 2) + ' Vl.Arquivo: ' + _.round(params.totals.vl_record068, 2) + ' Diferença: '+ difValues;
        // }
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

export const saveData = async (params, callback) => {
    const parsed = params.parsed;

    try {
        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  id = _.get(model, '_id', ''),
                  registro = _.get(model, 'registro', ''),
                  filter = { '_id': id };

            if (registro == '060') {
                await mongodb.cldr_rede_saldos_record060.upsert(filter, model);
            } else if (registro == '061') {
                await mongodb.cldr_rede_saldos_record061.upsert(filter, model);
            } else if (registro == '062') {
                await mongodb.cldr_rede_saldos_record062.upsert(filter, model);
            } else if (registro == '066') {
                await mongodb.cldr_rede_saldos_record066.upsert(filter, model);
            } else if (registro == '068') {
                await mongodb.cldr_rede_saldos_record068.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
