import _ from 'lodash'
import fs from 'fs'
import { md5 } from 'app/lib/utils'
import { mongodb } from 'app/models'
import { getIdTable } from 'app/jobs/skill/finance-files/cielo/common/tables'
import { getTag } from 'app/jobs/skill/commons/utils'
import { createKeyGroup, parserRecord0, parserRecord9, parserRecordX } from 'app/jobs/skill/finance-files/cielo/common/utils'

const parserRecord1 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, periodoFinal, tags } = params,
        tipo_transacao = _.trim(line.substr(23, 2)),
        ind_antecipacao = _.trim(line.substr(160, 1)),
        nro_terminal = _.trim(line.substr(224, 8)),
        nro_resumo = _.trim(line.substr(187, 15)),
        nro_pv = _.trim(line.substr(1, 10)),
        parcela = _.trim(line.substr(18, 2)),
        plano = _.trim(line.substr(21, 2)),
        planType = 'avista';

    if (_.isEmpty(parcela) == true) {
        parcela = '01';
    }
    if (_.isEmpty(plano) == true) {
        plano = '01';
    }
    let installment = parcela + '/' + plano;
    if (_.isEmpty(installment) == false) {
        if (installment == '01/01') {
            planType = 'rotativo';
        } else {
            planType = 'parcelado';
        }
    }
    if (tipo_transacao == '04') {
        if (nro_terminal == '99999999') {
            line += '-' + params.totals.planoCielo;
            nro_terminal += '-' + params.totals.planoCielo;
            params.totals.planoCielo += 1;
        }
    }

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'nro_parcela', installment)
    _.set(result, 'tipo_plano', planType)
    _.set(result, 'tag', getTag(tags, 'cielo', nro_pv))
    _.set(result, 'estabelecimento', nro_pv)
    _.set(result, 'nro_ro', _.trim(line.substr(11, 7)))
    _.set(result, 'nro_resumo', nro_resumo)
    _.set(result, 'parcela', parcela)
    _.set(result, 'filler', getIdTable('filler',_.trim(line.substr(20, 1))))
    _.set(result, 'plano', plano)
    _.set(result, 'tipo_transacao', getIdTable('tipo_transacao', tipo_transacao))
    _.set(result, 'dt_apresentacao', '20' + line.substr(25, 2) + '-' + line.substr(27, 2) + '-' + line.substr(29, 2))
    _.set(result, 'dt_pagamento', '20' + line.substr(31, 2) + '-' + line.substr(33, 2) + '-' + line.substr(35, 2))
    _.set(result, 'dt_envio_banco', '20' + line.substr(37, 2) + '-' + line.substr(39, 2) + '-' + line.substr(41, 2))
    _.set(result, 'dt_lancamento', periodoFinal)
    _.set(result, 'sinal_bruto', line.substr(43, 1))
    _.set(result, 'vl_bruto', Number(line.substr(44, 13)) / 100)
    _.set(result, 'sinal_comissao', line.substr(57, 1))
    _.set(result, 'vl_comissao', Number(line.substr(58, 13)) / 100)
    _.set(result, 'sinal_rejeitado', line.substr(71, 1))
    _.set(result, 'vl_rejeitado', Number(line.substr(72, 13)) / 100)
    _.set(result, 'sinal_liquido', line.substr(85, 1))
    _.set(result, 'vl_liquido', Number(line.substr(86, 13)) / 100)
    _.set(result, 'banco', _.trim(line.substr(99, 4)))
    _.set(result, 'agencia', _.trim(line.substr(103, 5)))
    _.set(result, 'conta_corrente', _.trim(line.substr(108, 14)))
    _.set(result, 'status_pagamento', getIdTable('status_pagamento', _.trim(line.substr(122, 2))))
    _.set(result, 'qt_cvs_aceitos', Number(_.trim(line.substr(124, 6))))
    _.set(result, 'cod_produto_antigo', _.trim(line.substr(130, 2)))
    _.set(result, 'qt_cvs_rejeitados', Number(_.trim(line.substr(132, 6))))
    _.set(result, 'ind_revenda', getIdTable('ind_revenda', _.trim(line.substr(138, 1))))
    _.set(result, 'dt_captura', '20' + line.substr(139, 2) + '-' + line.substr(141, 2) + '-' + line.substr(143, 2))
    _.set(result, 'origem_ajuste', getIdTable('origem_ajuste', _.trim(line.substr(145, 2))))
    _.set(result, 'vl_complementar', Number(line.substr(147, 13)) / 100)
    _.set(result, 'ind_antecipacao', getIdTable('ind_antecipacao', ind_antecipacao))
    _.set(result, 'nro_antecipacao', _.trim(line.substr(161, 9)))
    _.set(result, 'sinal_antecipado', line.substr(170, 1))
    _.set(result, 'vl_antecipado', Number(line.substr(171, 13)) / 100)
    _.set(result, 'bandeira', getIdTable('bandeira', _.trim(line.substr(184, 3))))
    _.set(result, 'nro_unico_ro', _.trim(line.substr(187, 22)))
    _.set(result, 'taxa_comissao', Number(line.substr(209, 4)) / 100)
    _.set(result, 'tarifa', Number(line.substr(213, 5)) / 100)
    _.set(result, 'taxa_garantia', Number(line.substr(218, 4)) / 100)
    _.set(result, 'meio_captura', getIdTable('meio_captura', _.trim(line.substr(222, 2))))
    _.set(result, 'nro_terminal', nro_terminal)
    _.set(result, 'cod_produto', getIdTable('cod_produto', _.trim(line.substr(232, 3))))
    _.set(result, 'matriz_pagamento', _.trim(line.substr(235, 10)))
    _.set(result, 'reenvio_pagamento', _.trim(line.substr(245, 1)))
    _.set(result, 'conceito_aplicado', _.trim(line.substr(246, 1)))
    _.set(result, 'uso_cielo', _.trim(line.substr(247, 3)))
    _.set(result, 'status_lancamento', 'previsto');
    _.set(result, 'modelo_lancamento', 'indefinido');
    _.set(result, 'tipo_lancamento', 'indefinido');
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'estabelecimento', '') + '-' + nro_resumo)
    if (result.sinal_bruto == '-') {
        result['vl_bruto'] = (-1 * result['vl_bruto']);
    }
    if (result.sinal_comissao == '-') {
        result['vl_comissao'] = (-1 * result['vl_comissao']);
    }
    if (result.sinal_rejeitado == '-') {
        result['vl_rejeitado'] = (-1 * result['vl_rejeitado']);
    }
    if (result.sinal_liquido == '-') {
        result['vl_liquido'] = (-1 * result['vl_liquido']);
    }
    if (result.sinal_antecipado == '-') {
        result['vl_antecipado'] = (-1 * result['vl_antecipado']);
    }
    params.totals.qtd_records += 1;
    params.totals.vl_summary += result.vl_liquido;

    let status = _.get(result, 'status_pagamento.code'),
        origem_ajuste = _.get(result, 'origem_ajuste.code', ''),
        tipo_lancamento = _.get(getIdTable('origem_ajuste', origem_ajuste), 'kind', ''),
        modelo_lancamento = 'saldo_inicial';

    tipo_lancamento = (tipo_transacao == '01' ? 'saldo_inicial' : tipo_lancamento);
    if (tipo_lancamento == 'ajustes') {
        modelo_lancamento = tipo_lancamento;
        if (tipo_transacao == '02') {
            tipo_lancamento = 'ajuste_a_credito';
        } else {
            tipo_lancamento = 'ajuste_a_debito';
        }
    } else if (tipo_lancamento != 'saldo_inicial') {
        modelo_lancamento = tipo_lancamento;
    }
    if (tipo_lancamento == 'aluguel_equipamentos') {
        modelo_lancamento = 'aluguel';
    }
    if ((status == '01') || (status == '02')) {
        result['status_lancamento'] = 'pago';
    }
    if (ind_antecipacao != '') {
        result['status_lancamento'] = 'antecipado';
    }
    result['modelo_lancamento'] = modelo_lancamento;
    result['tipo_lancamento'] = tipo_lancamento;

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

            fs.readFile(fullPath, 'utf8', function(err, contents) {
                if (err) {
                    throw err;
                }

                let lines = contents.split('\n'),
                    totals = {
                        'qtd_records': 0,
                        'qtd_file': 0,
                        'vl_summary': 0,
                        'vl_file': 0,
                        'planoCielo': 1
                    },
                    periodoFinal = '',
                    parsed = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 1),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, fileType, periodoFinal, totals, lineNumber, tags };

                    if (type == '0') {
                        const record = parserRecord0(args);
                        let nroSequencial = _.get(record, 'nro_sequencial', ''),
                            temp = [];
                        temp.push(nroSequencial);
                        temp.push(_.get(record, 'dt_arquivo', ''));
                        fileKey = temp.join('');
                        parsed.push(record);
                        params['nroSequencial'] = nroSequencial;
                        periodoFinal = _.get(record, 'periodo_final', '');
                    } else if (type == '1') {
                        parsed.push(parserRecord1(args));
                    } else if (type == '2') {
                        parsed.push(parserRecordX(args));
                    } else if (type == '3') {
                        parsed.push(parserRecordX(args));
                    } else if (type == '5') {
                        parsed.push(parserRecordX(args));
                    } else if (type == '6') {
                        parsed.push(parserRecordX(args));
                    } else if (type == '7') {
                        parsed.push(parserRecordX(args));
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
            nroSequencial = _.get(params, 'nroSequencial', ''),
            difQuantity = _.round(params.totals.qtd_records - params.totals.qtd_file, 2),
            difValues = _.round(params.totals.vl_summary - params.totals.vl_file, 2);

        if (nroSequencial == '9999999') {
            errorMessage += 'Arquivo de reprocessamento não permitido. Favor entrar em contato com o suporte.';
        }
        if (difQuantity != 0) {
            errorMessage += 'Qt.Transações: ' + params.totals.qtd_records + ' Qt.Arquivo: ' + params.totals.qtd_file;
        }
        if (difValues != 0) {
            errorMessage += ' Vl.Resumos: ' + _.round(params.totals.vl_summary, 2) + ' Vl.Arquivo: ' + _.round(params.totals.vl_file, 2) + ' Diferença: '+ difValues;
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

            if (registro == '0') {
                await mongodb.cldr_cielo_saldos_record0.upsert(filter, model);
            } else if (registro == '1') {
                await mongodb.cldr_cielo_saldos_record1.upsert(filter, model);
            } else if (registro == '2') {
                await mongodb.cldr_cielo_saldos_recordX.upsert(filter, model);
            } else if (registro == '3') {
                await mongodb.cldr_cielo_saldos_recordX.upsert(filter, model);
            } else if (registro == '5') {
                await mongodb.cldr_cielo_saldos_recordX.upsert(filter, model);
            } else if (registro == '6') {
                await mongodb.cldr_cielo_saldos_recordX.upsert(filter, model);
            } else if (registro == '7') {
                await mongodb.cldr_cielo_saldos_recordX.upsert(filter, model);
            } else if (registro == '9') {
                await mongodb.cldr_cielo_saldos_record9.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
