import _ from 'lodash'
import fs from 'fs'
import { mongodb } from 'app/models'
import { md5, sizedField } from 'app/lib/utils'
import { getIdTable } from 'app/jobs/skill/finance-files/rede/common/tables'
import { setTidPedido, parserForKeys, setCommissionRate } from 'app/jobs/skill/finance-files/rede/common/utils'
import { getTransactionKeys, getTag } from 'app/jobs/skill/commons/utils'

const parserRecord00 = (params) => {
    let result = {},
        { line, lineNumber } = params,
        temp = _.split(line, ',');

    _.set(result, '_id', md5(line));
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_grupo', temp[1])
    _.set(result, 'dt_emissao', temp[2].substr(4, 4) + '-' + temp[2].substr(2, 2) + '-' + temp[2].substr(0, 2))
    _.set(result, 'dt_movimento', temp[3].substr(4, 4) + '-' + temp[3].substr(2, 2) + '-' + temp[3].substr(0, 2))
    _.set(result, 'info_01', temp[4])
    _.set(result, 'info_02', temp[5])
    _.set(result, 'nome_comercial', _.trim(temp[6]))
    _.set(result, 'nro_sequencial', _.trim(temp[7]))
    _.set(result, 'tipo_processamento', _.trim(temp[8]))
    _.set(result, 'versao_arquivo', _.trim(temp[9]))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord01 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        temp = _.split(line, ','),
        nro_pv = temp[1];

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_parcela', '01/01')
    _.set(result, 'tipo_plano', 'avista')
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'dt_credito', temp[2].substr(4, 4) + '-' + temp[2].substr(2, 2) + '-' + temp[2].substr(0, 2))
    _.set(result, 'dt_rv', temp[3].substr(4, 4) + '-' + temp[3].substr(2, 2) + '-' + temp[3].substr(0, 2))
    _.set(result, 'nro_rv', temp[4])
    _.set(result, 'qtd_cv', Number(temp[5]))
    _.set(result, 'vl_bruto', Number(temp[6]) / 100)
    _.set(result, 'vl_desconto', Number(temp[7]) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_liquido', Number(temp[8]) / 100)
    _.set(result, 'tipo_resumo', getIdTable(fileType, 'tipo_resumo', _.trim(temp[9])))
    _.set(result, 'banco', _.trim(temp[10]))
    _.set(result, 'agencia', _.trim(temp[11]))
    _.set(result, 'conta_corrente', _.trim(temp[12]))
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', _.trim(temp[13].replace(/\n/, ''))))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'dt_rv', '') + '-' + _.get(result, 'nro_rv', ''))

    setCommissionRate(result);

    params.totals.qtd_record1 += result.qtd_cv;
    params.totals.vl_record1 += result.vl_bruto;

    return result;
}

const parserRecord02 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params,
        temp = _.split(line, ',');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_matriz', temp[1])
    _.set(result, 'qtd_resumos', Number(temp[2]))
    _.set(result, 'qtd_cv', Number(temp[3]))
    _.set(result, 'vl_bruto', Number(temp[4]) / 100)
    _.set(result, 'vl_desconto', Number(temp[5]) / 100)
    _.set(result, 'vl_liquido', Number(temp[6]) / 100)
    _.set(result, 'vl_bruto_pre', Number(temp[7]) / 100)
    _.set(result, 'vl_desconto_pre', Number(temp[8]) / 100)
    _.set(result, 'vl_liquido_pre', Number(temp[9]) / 100)
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord03 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params,
        temp = _.split(line, ',');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_matriz', temp[1])
    _.set(result, 'qtd_resumos', Number(temp[2]))
    _.set(result, 'qtd_cv', Number(temp[3]))
    _.set(result, 'vl_bruto', Number(temp[4]) / 100)
    _.set(result, 'vl_desconto', Number(temp[5]) / 100)
    _.set(result, 'vl_liquido', Number(temp[6]) / 100)
    _.set(result, 'vl_bruto_pre', Number(temp[7]) / 100)
    _.set(result, 'vl_desconto_pre', Number(temp[8]) / 100)
    _.set(result, 'vl_liquido_pre', Number(temp[9]) / 100)
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord04 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params,
        temp = _.split(line, ',');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_matriz', temp[1])
    _.set(result, 'qtd_resumos', Number(temp[2]))
    _.set(result, 'qtd_cvs', Number(temp[3]))
    _.set(result, 'vl_total_bruto', Number(temp[4]) / 100)
    _.set(result, 'vl_total_desconto', Number(temp[5]) / 100)
    _.set(result, 'vl_total_liquido', Number(temp[6]) / 100)
    _.set(result, 'vl_bruto_pre_datado', Number(temp[7]) / 100)
    _.set(result, 'vl_desconto_pre_datado', Number(temp[8]) / 100)
    _.set(result, 'vl_liquido_pre_datado', Number(temp[9]) / 100)
    _.set(result, 'qtd_total_arquivo', Number(temp[10]))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parserRecord05 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        temp = _.split(line, ','),
        nro_pv = temp[1];

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, '_keys', {})
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv', nro_pv)
    _.set(result, 'nro_rv', temp[2])
    _.set(result, 'data', temp[3].substr(4, 4) + '-' + temp[3].substr(2, 2) + '-' + temp[3].substr(0, 2))
    _.set(result, 'vl_bruto', Number(temp[4]) / 100)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_desconto', Number(temp[5]) / 100)
    _.set(result, 'vl_liquido', Number(temp[6]) / 100)
    _.set(result, 'nro_cartao', _.trim(temp[7]))
    _.set(result, 'tipo_transacao', getIdTable(fileType, 'tipo_transacao', _.trim(temp[8])))
    _.set(result, 'nro_cv', temp[9])
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'dt_credito', temp[10].substr(4, 4) + '-' + temp[10].substr(2, 2) + '-' + temp[10].substr(0, 2))
    _.set(result, 'status_transacao', getIdTable(fileType, 'status', _.trim(temp[11])))
    _.set(result, 'hora_transacao', temp[12].substr(0, 2) + ':' + temp[12].substr(2, 2) + ':' + temp[12].substr(4, 2))
    _.set(result, 'nro_terminal', temp[13])
    _.set(result, 'tipo_captura', getIdTable(fileType, 'tipo_captura', _.trim(temp[14])))
    _.set(result, 'vl_compra', Number(temp[16]) / 100)
    _.set(result, 'vl_saque', Number(temp[17]) / 100)
    _.set(result, 'bandeira', getIdTable(fileType, 'bandeiras', _.trim(temp[18].replace(/\n/, ''))))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv', ''))
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'data', '') + '-' + _.get(result, 'nro_rv', ''))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)));

    setCommissionRate(result);

    params.totals.qtd_record5 += 1;
    params.totals.vl_record5 += result.vl_bruto;

    return result;
}

const parserRecord13 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params,
        temp = _.split(line, ',');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_pv', temp[1])
    _.set(result, 'nro_rv', temp[2])
    _.set(result, 'data', temp[3].substr(4, 4) + '-' + temp[3].substr(2, 2) + '-' + temp[3].substr(0, 2))
    _.set(result, 'valor', Number(temp[4]) / 100)
    _.set(result, 'nro_cartao', _.trim(temp[5]))
    _.set(result, 'nro_cv', temp[6])
    _.set(result, 'tid', temp[7])
    _.set(result, 'nro_pedido', _.trim(temp[8].replace(/\n/, '')))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_cv', ''))

    setTidPedido('05', result, parsed)

    return result;
}

const parserRecord11 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        temp = _.split(line, ','),
        nro_pv = _.trim(temp[1]);

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_keys', {})
    _.set(result, '_resumo_venda', '')
    _.set(result, '_resumo_original', '')
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_parcela', '01/01')
    _.set(result, 'tipo_plano', 'rotativo')
    _.set(result, 'tag', getTag(tags, 'rede', nro_pv))
    _.set(result, 'nro_pv_ajustado', nro_pv)
    _.set(result, 'nro_rv_ajustado', _.trim(temp[2]))
    _.set(result, 'dt_ajuste', temp[3].substr(4, 4) + '-' + temp[3].substr(2, 2) + '-' + temp[3].substr(0, 2))
    _.set(result, 'vl_ajuste', Number(temp[4]) / 100)
    _.set(result, 'tipo_ajuste', getIdTable(fileType, 'tipo_ajuste', _.trim(temp[5])))
    _.set(result, 'motivo_ajuste_cod', _.trim(temp[6]))
    _.set(result, 'motivo_ajuste_desc', _.trim(temp[7]))
    _.set(result, 'nro_cartao', _.trim(temp[8]))
    _.set(result, 'dt_transacao', temp[9].substr(4, 4) + '-' + temp[9].substr(2, 2) + '-' + temp[9].substr(0, 2))
    _.set(result, 'nro_rv_original', _.trim(temp[10]))
    _.set(result, 'nro_carta', _.trim(temp[11]))
    _.set(result, 'dt_carta', temp[12].substr(4, 4) + '-' + temp[12].substr(2, 2) + '-' + temp[12].substr(0, 2))
    _.set(result, 'mes_referencia', temp[13].substr(4, 2) + temp[13].substr(0, 2) + '-' + temp[13].substr(2, 2))
    _.set(result, 'nro_pv_original', _.trim(temp[14]))
    _.set(result, 'dt_rv_original', temp[15].substr(4, 4) + '-' + temp[15].substr(2, 2) + '-' + temp[15].substr(0, 2))
    _.set(result, 'vl_transacao', Number(temp[16]) / 100)
    _.set(result, 'tipo_movimento', getIdTable(fileType, 'tipo_movimento', _.trim(temp[17])))
    _.set(result, 'dt_credito', temp[18].substr(4, 4) + '-' + temp[18].substr(2, 2) + '-' + temp[18].substr(0, 2))
    _.set(result, 'vl_bruto_resumo', Number(temp[19]) / 100)
    _.set(result, 'vl_cancelamento', Number(temp[20]) / 100)
    _.set(result, 'nro_nsu', _.trim(temp[21]))
    _.set(result, 'tid', '')
    _.set(result, 'nro_pedido', '')
    _.set(result, 'banco', '')
    _.set(result, 'agencia', '')
    _.set(result, 'conta_corrente', '')
    _.set(result, 'nro_autorizacao', _.trim(temp[22]))
    _.set(result, 'tipo_debito', _.trim(temp[23]))
    _.set(result, 'nro_ordem_debito', _.trim(temp[24]))
    _.set(result, 'vl_debito', Number(temp[25]) / 100)
    _.set(result, 'vl_pendente', Number(temp[26]) / 100)
    _.set(result, 'bandeira_rv_origem', getIdTable('eefi', 'bandeiras', _.trim(temp[27])))
    _.set(result, 'bandeira_rv_ajustado', getIdTable(fileType, 'bandeiras', _.trim(temp[28])))
    _.set(result, 'modelo_lancamento', 'indefinido')
    _.set(result, 'tipo_lancamento', 'indefinido')
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'nro_rv_original', '') + '-' + _.get(result, 'nro_nsu', ''))
    _.set(result, '_resumo_venda', _.get(result, 'nro_pv_ajustado', '') + '-' + _.get(result, 'dt_ajuste', '') + '-' + _.get(result, 'nro_rv_ajustado', ''))
    _.set(result, '_resumo_original', _.get(result, 'nro_pv_original', '') + '-' + _.get(result, 'dt_rv_original', '') + '-' + _.get(result, 'nro_rv_original', ''))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)));

    const idsAluguel = ['06', '20', '28', '48', '49'],
          idMotivo = _.get(result, 'motivo_ajuste_cod', ''),
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

    let filterResumo = {
            'registro': '01',
            '_resumo_venda': _.get(result, '_resumo_venda', '')
        },
        resumo = _.findLast(parsed, filterResumo);
    if (resumo) {
        result['banco'] = _.get(resumo, 'banco', '');
        result['agencia'] = _.get(resumo, 'agencia', '');
        result['conta_corrente'] = _.get(resumo, 'conta_corrente', '');
    }

    return result;
}

const parserRecord17 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params,
        temp = _.split(line, ',');

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_key', '')
    _.set(result, 'tipo_venda', 'debito')
    _.set(result, 'registro', temp[0])
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_cartao', _.trim(temp[1]))
    _.set(result, 'dt_transacao', temp[2].substr(4, 4) + '-' + temp[2].substr(2, 2) + '-' + temp[2].substr(0, 2))
    _.set(result, 'nro_rv', temp[3])
    _.set(result, 'nro_pv', temp[4])
    _.set(result, 'dt_rv_original', temp[5].substr(4, 4) + '-' + temp[5].substr(2, 2) + '-' + temp[5].substr(0, 2))
    _.set(result, 'valor', Number(temp[6]) / 100)
    _.set(result, 'nro_nsu', temp[7])
    _.set(result, 'nro_autorizacao', temp[8])
    _.set(result, 'tid', temp[9])
    _.set(result, 'nro_pedido', _.trim(temp[10].replace(/\n/, '')))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_key', _.get(result, 'nro_pv', '') + '-' + _.get(result, 'nro_rv', '') + '-' + _.get(result, 'nro_nsu', ''))

    setTidPedido('011', result, parsed)

    return result;
}

export const parser = async (params) => {
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

            fs.readFile(fullPath, 'utf8', async function(err, contents) {
                if (err) {
                    throw err;
                }

                let lines = contents.split('\n'),
                    totals = {
                        'qtd_record1': 0,
                        'qtd_record5': 0,
                        'vl_record1': 0,
                        'vl_record5': 0
                    },
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = _.first(_.split(line, ',')),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, fileType, totals, lineNumber, tags };

                    if (type == '00') {
                        let temp = [];
                        const record00 = parserRecord00(args);
                        temp.push(_.get(record00, 'nro_sequencial', ''));
                        temp.push(_.get(record00, 'dt_emissao', ''));
                        temp.push(_.get(record00, 'dt_movimento', ''));
                        fileKey = temp.join('');
                        parsed.push(record00);
                    } else if (type == '01') {
                        parsed.push(parserRecord01(args));
                    } else if (type == '02') {
                        parsed.push(parserRecord02(args));
                    } else if (type == '03') {
                        parsed.push(parserRecord03(args));
                    } else if (type == '04') {
                        parsed.push(parserRecord04(args));
                    } else if (type == '05') {
                        parsed.push(parserRecord05(args));
                    } else if (type == '13') {
                        parsed.push(parserRecord13(args, parsed));
                    } else if (type == '011') {
                        parsed.push(parserRecord11(args, parsed));
                    } else if (type == '17') {
                        parsed.push(parserRecord17(args, parsed));
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
            difQuantity = _.round(params.totals.qtd_record5 - params.totals.qtd_record1, 2),
            difValues = _.round(params.totals.vl_record5 - params.totals.vl_record1, 2);

        if (difQuantity != 0) {
            errorMessage = 'Qt.Transações: ' + params.totals.qtd_record5 + ' Qt.Resumos: ' + params.totals.qtd_record1;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Transações: ' + _.round(params.totals.vl_record5, 2) + ' Vl.Resumos: ' + _.round(params.totals.vl_record1, 2) + ' Diferença: '+ difValues;
        }
        if (errorMessage != '') {
            params['status'] = 'error';
            params['errorMessage'] = _.trim(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw error;
    }
}

export const saveData = async (params) => {
    const parsed = params.parsed;

    try {
        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  id = _.get(model, '_id', ''),
                  registro = _.get(model, 'registro', ''),
                  filter = { '_id': id };

            if (registro == '00') {
                await mongodb.cldr_rede_debito_record00.upsert(filter, model);
            } else if (registro == '01') {
                await mongodb.cldr_rede_debito_record01.upsert(filter, model);
            } else if (registro == '02') {
                await mongodb.cldr_rede_debito_record02.upsert(filter, model);
            } else if (registro == '03') {
                await mongodb.cldr_rede_debito_record03.upsert(filter, model);
            } else if (registro == '04') {
                await mongodb.cldr_rede_debito_record04.upsert(filter, model);
            } else if (registro == '05') {
                await mongodb.cldr_rede_debito_record05.upsert(filter, model);
            } else if (registro == '011') {
                await mongodb.cldr_rede_debito_record11.upsert(filter, model);
            } else if (registro == '13') {
                await mongodb.cldr_rede_debito_record13.upsert(filter, model);
            } else if (registro == '17') {
                await mongodb.cldr_rede_debito_record17.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
