import _ from 'lodash'
import fs from 'fs'
import { md5 } from 'app/lib/utils'
import { mongodb } from 'app/models'
import { getIdTable } from 'app/jobs/skill/finance-files/cielo/common/tables'
import { getTransactionKeys, getTag } from 'app/jobs/skill/commons/utils'
import { createKeyGroup, parserForKeys, parserRecord0, parserRecord9, parserRecordX } from 'app/jobs/skill/finance-files/cielo/common/utils'

const parserRecord2 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params,
        nro_resumo = _.trim(line.substr(188, 15));

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, '_resumo_venda', '')
    _.set(result, '_keys', {})
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'estabelecimento', _.trim(line.substr(1, 10)))
    _.set(result, 'nro_ro', _.trim(line.substr(11, 7)))
    _.set(result, 'nro_resumo', nro_resumo)
    _.set(result, 'nro_cartao', _.trim(line.substr(18, 19)))
    _.set(result, 'dt_venda_ajuste', line.substr(37, 4) + '-' + line.substr(41, 2) + '-' + line.substr(43, 2))
    _.set(result, 'sinal_parcela', line.substr(45, 1))
    _.set(result, 'vl_parcela', Number(line.substr(46, 13)) / 100)
    _.set(result, 'parcela', _.trim(line.substr(59, 2)))
    _.set(result, 'total_parcela', _.trim(line.substr(61, 2)))
    _.set(result, 'motivo_rejeicao', getIdTable('motivo_rejeicao', _.trim(line.substr(63, 3))))
    _.set(result, 'cod_autorizacao', _.trim(line.substr(66, 6)))
    _.set(result, 'tid', _.trim(line.substr(72, 20)))
    _.set(result, 'nro_nsu_doc', _.trim(line.substr(92, 6)))
    _.set(result, 'vl_complementar', Number(line.substr(98, 13)) / 100)
    _.set(result, 'digitos_cartao', _.trim(line.substr(111, 2)))
    _.set(result, 'vl_total_venda', Number(line.substr(113, 13)) / 100)
    _.set(result, 'vl_proxima_parcela', Number(line.substr(126, 13)) / 100)
    _.set(result, 'vl_transacao', 0)
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'vl_comissao', 0)
    _.set(result, 'vl_liquido', 0)
    _.set(result, 'taxa_antecipacao', 0)
    _.set(result, 'vl_desconto', 0)
    _.set(result, 'vl_antecipado', 0)
    _.set(result, 'nro_nota_fiscal', _.trim(line.substr(139, 9)))
    _.set(result, 'ind_cartao_emitido', getIdTable('ind_cartao_emitido', _.trim(line.substr(148, 4))))
    _.set(result, 'nro_terminal', _.trim(line.substr(152, 8)))
    _.set(result, 'ind_taxa_entrada', getIdTable('ind_taxa_entrada', _.trim(line.substr(160, 2))))
    _.set(result, 'nro_pedido', _.trim(line.substr(162, 20)))
    _.set(result, 'hr_transacao', line.substr(182, 2) + ':' + line.substr(184, 2) + ':' + line.substr(186, 2))
    _.set(result, 'nro_transacao', _.trim(line.substr(188, 29)))
    _.set(result, 'ind_cielo', _.trim(line.substr(217, 1)))
    _.set(result, 'modo_entrada_cartao', getIdTable('modo_entrada_cartao', line.substr(218, 2)))
    _.set(result, 'codigo_venda', _.trim(line.substr(220, 15)))
    _.set(result, 'cod_interno_ajuste', _.trim(line.substr(235, 15)))
    _.set(result, 'tipo_produto', getIdTable('tipo_produto', line.substr(11, 1)))
    _.set(result, 'status_lancamento', 'previsto');
    _.set(result, 'tipo_lancamento', 'indefinido');
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'estabelecimento', '') + '-' + _.trim(line.substr(188, 15)))
    _.set(result, '_keys', getTransactionKeys(parserForKeys(result)))
    if (result.sinal_parcela == '-') {
        result['vl_parcela'] = (-1 * result['vl_parcela']);
    }
    params.totals.qtd_records += 1;

    let filterResumo = {
            'registro': '6',
            'cielo_key_group': _.get(result, 'cielo_key_group', '')
        },
        resumo = _.findLast(parsed, filterResumo),
        vl_transacao = result.vl_parcela;

    if (resumo) {
        result['taxa_comissao'] = _.get(resumo, 'taxa_comissao', 0);
        result['vl_transacao'] = vl_transacao;
        result['vl_comissao'] = _.round(((vl_transacao * result.taxa_comissao) / 100), 2);
        result['vl_liquido'] = _.round((vl_transacao - result.vl_comissao), 2);

        result['taxa_antecipacao'] = _.get(resumo, 'taxa_antecipacao', 0);
        result['vl_desconto'] = _.round(((result.vl_liquido * result.taxa_antecipacao) / 100), 2);
        result['vl_antecipado'] = _.round((result.vl_liquido - result.vl_desconto), 2);

        result['dt_pagamento'] = _.get(resumo, 'dt_credito', '');
        result['bandeira'] = _.get(resumo, 'bandeira', '');
        result['status_lancamento'] = _.get(resumo, 'status_lancamento', '');
        result['tipo_lancamento'] = _.get(resumo, 'tipo_lancamento', '');
    }

    return result;
}

const parserRecord5 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'estabelecimento', _.trim(line.substr(1, 10)))
    _.set(result, 'nro_operacao', _.trim(line.substr(11, 9)))
    _.set(result, 'dt_credito', line.substr(20, 4) + '-' + line.substr(24, 2) + '-' + line.substr(26, 2))
    _.set(result, 'sinal_bruto_a_vista', line.substr(28, 1))
    _.set(result, 'vl_bruto_a_vista', Number(line.substr(29, 13)) / 100)
    _.set(result, 'sinal_bruto_parcelado', line.substr(42, 1))
    _.set(result, 'vl_bruto_parcelado', Number(line.substr(43, 13)) / 100)
    _.set(result, 'sinal_bruto_pre_datado', line.substr(56, 1))
    _.set(result, 'vl_bruto_pre_datado', Number(line.substr(57, 13)) / 100)
    _.set(result, 'sinal_bruto_antecipacao', line.substr(70, 1))
    _.set(result, 'vl_bruto_antecipacao', Number(line.substr(71, 13)) / 100)
    _.set(result, 'sinal_liquido_a_vista', line.substr(84, 1))
    _.set(result, 'vl_liquido_a_vista', Number(line.substr(85, 13)) / 100)
    _.set(result, 'sinal_liquido_parcelado', line.substr(98, 1))
    _.set(result, 'vl_liquido_parcelado', Number(line.substr(99, 13)) / 100)
    _.set(result, 'sinal_liquido_pre_datado', line.substr(112, 1))
    _.set(result, 'vl_liquido_pre_datado', Number(line.substr(113, 13)) / 100)
    _.set(result, 'sinal_liquido_antecipacao', line.substr(126, 1))
    _.set(result, 'vl_liquido_antecipacao', Number(line.substr(127, 13)) / 100)
    _.set(result, 'taxa_desconto_antecipacao', Number(line.substr(140, 5)) / 1000)
    _.set(result, 'banco', _.trim(line.substr(145, 4)))
    _.set(result, 'agencia', _.trim(line.substr(149, 5)))
    _.set(result, 'conta_corrente', _.trim(line.substr(154, 14)))
    _.set(result, 'sinal_liquido_antecipacao_total', line.substr(168, 1))
    _.set(result, 'vl_liquido_antecipacao_total', Number(line.substr(169, 13)) / 100)
    _.set(result, 'sinal_tarifa', line.substr(182, 1))
    _.set(result, 'vl_tarifa', Number(line.substr(183, 9)) / 100)
    _.set(result, 'uso_cielo', _.trim(line.substr(192, 58)))
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    if (result.sinal_bruto_a_vista == '-') {
        result['vl_bruto_a_vista'] = (-1 * result['vl_bruto_a_vista']);
    }
    if (result.sinal_bruto_parcelado == '-') {
        result['vl_bruto_parcelado'] = (-1 * result['vl_bruto_parcelado']);
    }
    if (result.sinal_bruto_pre_datado == '-') {
        result['vl_bruto_pre_datado'] = (-1 * result['vl_bruto_pre_datado']);
    }
    if (result.sinal_bruto_antecipacao == '-') {
        result['vl_bruto_antecipacao'] = (-1 * result['vl_bruto_antecipacao']);
    }
    if (result.sinal_liquido_a_vista == '-') {
        result['vl_liquido_a_vista'] = (-1 * result['vl_liquido_a_vista']);
    }
    if (result.sinal_liquido_parcelado == '-') {
        result['vl_liquido_parcelado'] = (-1 * result['vl_liquido_parcelado']);
    }
    if (result.sinal_liquido_pre_datado == '-') {
        result['vl_liquido_pre_datado'] = (-1 * result['vl_liquido_pre_datado']);
    }
    if (result.sinal_liquido_antecipacao == '-') {
        result['vl_liquido_antecipacao'] = (-1 * result['vl_liquido_antecipacao']);
    }
    if (result.sinal_liquido_antecipacao_total == '-') {
        result['vl_liquido_antecipacao_total'] = (-1 * result['vl_liquido_antecipacao_total']);
    }
    if (result.sinal_tarifa == '-') {
        result['vl_tarifa'] = (-1 * result['vl_tarifa']);
    }
    params.totals.qtd_records += 1;

    return result;
}

const parserRecord6 = (params, parsed) => {
    let result = {},
        { line, fileKey, fileType, lineNumber, tags } = params,
        nro_resumo = _.trim(line.substr(98, 15)),
        nro_pv = _.trim(line.substr(1, 10)),
        parcela = _.trim(line.substr(35, 2)),
        plano = _.trim(line.substr(37, 2)),
        planType = 'avista';

    if (_.isEmpty(parcela) == true) {
        parcela = '01';
    }
    if (_.isEmpty(plano) == true) {
        plano = '01';
    }
    let installment = parcela + '/' + plano;
    if (installment == '00/00') {
        installment = '01/01'
    }
    if (_.isEmpty(installment) == false) {
        if (installment == '01/01') {
            planType = 'rotativo';
        } else {
            planType = 'parcelado';
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
    _.set(result, 'nro_resumo', nro_resumo)
    _.set(result, 'nro_operacao', _.trim(line.substr(11, 9)))
    _.set(result, 'dt_vencimento_ro', line.substr(20, 4) + '-' + line.substr(24, 2) + '-' + line.substr(26, 2))
    _.set(result, 'nro_ro_antecipado', _.trim(line.substr(28, 7)))
    _.set(result, 'parcela_antecipada', parcela)
    _.set(result, 'total_parcelas', plano)
    _.set(result, 'sinal_bruto_original', line.substr(39, 1))
    _.set(result, 'vl_bruto_original', Number(line.substr(40, 13)) / 100)
    _.set(result, 'sinal_liquido_original', line.substr(53, 1))
    _.set(result, 'vl_liquido_original', Number(line.substr(54, 13)) / 100)
    _.set(result, 'sinal_bruto_antecipacao', line.substr(67, 1))
    _.set(result, 'vl_bruto_antecipacao', Number(line.substr(68, 13)) / 100)
    _.set(result, 'sinal_liquido_antecipacao', line.substr(81, 1))
    _.set(result, 'vl_liquido_antecipacao', Number(line.substr(82, 13)) / 100)
    _.set(result, 'bandeira', getIdTable('bandeira', _.trim(line.substr(95, 3))))
    _.set(result, 'nro_unico_ro', _.trim(line.substr(98, 22)))
    _.set(result, 'identificador_ro', _.trim(line.substr(120, 1)))
    _.set(result, 'uso_cielo', _.trim(line.substr(121, 129)))
    _.set(result, 'dt_credito', '')
    _.set(result, 'banco', '')
    _.set(result, 'agencia', '')
    _.set(result, 'conta_corrente', '')
    _.set(result, 'taxa_comissao', 0)
    _.set(result, 'taxa_antecipacao', 0)
    _.set(result, 'status_lancamento', 'pago');
    _.set(result, 'tipo_lancamento', 'antecipacao');
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    _.set(result, '_resumo_venda', _.get(result, 'estabelecimento', '') + '-' + nro_resumo)
    if (result.sinal_bruto_original == '-') {
        result['vl_bruto_original'] = (-1 * result['vl_bruto_original']);
    }
    if (result.sinal_liquido_original == '-') {
        result['vl_liquido_original'] = (-1 * result['vl_liquido_original']);
    }
    if (result.sinal_bruto_antecipacao == '-') {
        result['vl_bruto_antecipacao'] = (-1 * result['vl_bruto_antecipacao']);
    }
    if (result.sinal_liquido_antecipacao == '-') {
        result['vl_liquido_antecipacao'] = (-1 * result['vl_liquido_antecipacao']);
    }
    if (result.vl_bruto_original > 0) {
        result['taxa_comissao'] = _.round((1 - (result.vl_liquido_original / result.vl_bruto_original)) * 100, 2);
    }
    if (result.vl_bruto_antecipacao > 0) {
        result['taxa_antecipacao'] = _.round((1 - (result.vl_liquido_antecipacao / result.vl_bruto_antecipacao)) * 100, 2);
    }
    params.totals.qtd_records += 1;
    params.totals.vl_summary += result.vl_liquido_antecipacao;
    let filterOperacao = {
            'registro': '5',
            'nro_operacao': _.get(result, 'nro_operacao', '')
        },
        resumoOperacao = _.findLast(parsed, filterOperacao);

    if (resumoOperacao) {
        result['dt_credito'] = _.get(resumoOperacao, 'dt_credito', '');
        result['banco'] = _.get(resumoOperacao, 'banco', '');
        result['agencia'] = _.get(resumoOperacao, 'agencia', '');
        result['conta_corrente'] = _.get(resumoOperacao, 'conta_corrente', '');
    }

    return result;
}

const parserRecord7 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'estabelecimento', _.trim(line.substr(1, 10)))
    _.set(result, 'nro_unico_ro_original', _.trim(line.substr(11, 22)))
    _.set(result, 'nro_ro_antecipado', _.trim(line.substr(33, 7)))
    _.set(result, 'dt_pagto_ro_antecipado', line.substr(40, 4) + '-' + line.substr(44, 2) + '-' + line.substr(46, 2))
    _.set(result, 'sinal_ro_antecipado', line.substr(48, 1))
    _.set(result, 'vl_ro_antecipado', Number(line.substr(49, 13)) / 100)
    _.set(result, 'nro_unico_ro_ajuste', _.trim(line.substr(62, 22)))
    _.set(result, 'nro_ro_ajuste', _.trim(line.substr(84, 7)))
    _.set(result, 'dt_pagto_ajuste', line.substr(91, 4) + '-' + line.substr(95, 2) + '-' + line.substr(97, 2))
    _.set(result, 'sinal_ajuste_debito', line.substr(99, 1))
    _.set(result, 'vl_ajuste_debito', Number(line.substr(100, 13)) / 100)
    _.set(result, 'sinal_compensado', line.substr(113, 1))
    _.set(result, 'vl_compensado', Number(line.substr(114, 13)) / 100)
    _.set(result, 'sinal_saldo_ro_antecipado', line.substr(127, 1))
    _.set(result, 'vl_saldo_ro_antecipado', Number(line.substr(128, 13)) / 100)
    _.set(result, 'uso_cielo', _.trim(line.substr(141, 109)))
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    params.totals.qtd_records += 1;

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
                        'vl_file': 0
                    },
                    parsed = [];
                lines = createKeyGroup(lines);
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i],
                        type = line.substr(0, 1),
                        lineNumber = (i + 1),
                        args = { line, fileId, fileKey, fileType, totals, lineNumber, tags };

                    if (type == '0') {
                        const record = parserRecord0(args);
                        let nroSequencial = _.get(record, 'nro_sequencial', ''),
                            temp = [];
                        temp.push(nroSequencial);
                        temp.push(_.get(record, 'dt_arquivo', ''));
                        fileKey = temp.join('');
                        parsed.push(record);
                        params['nroSequencial'] = nroSequencial;
                    } else if (type == '1') {
                        parsed.push(parserRecordX(args));
                    } else if (type == '2') {
                        parsed.push(parserRecord2(args, parsed));
                    } else if (type == '3') {
                        parsed.push(parserRecordX(args));
                    } else if (type == '5') {
                        parsed.push(parserRecord5(args));
                    } else if (type == '6') {
                        parsed.push(parserRecord6(args, parsed));
                    } else if (type == '7') {
                        parsed.push(parserRecord7(args));
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

export const validate = (params) => {
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
                await mongodb.cldr_cielo_antecipacao_record0.upsert(filter, model);
            } else if (registro == '1') {
                await mongodb.cldr_cielo_antecipacao_recordX.upsert(filter, model);
            } else if (registro == '2') {
                await mongodb.cldr_cielo_antecipacao_record2.upsert(filter, model);
            } else if (registro == '3') {
                await mongodb.cldr_cielo_antecipacao_recordX.upsert(filter, model);
            } else if (registro == '5') {
                await mongodb.cldr_cielo_antecipacao_record5.upsert(filter, model);
            } else if (registro == '6') {
                await mongodb.cldr_cielo_antecipacao_record6.upsert(filter, model);
            } else if (registro == '7') {
                await mongodb.cldr_cielo_antecipacao_record7.upsert(filter, model);
            } else if (registro == '9') {
                await mongodb.cldr_cielo_antecipacao_record9.upsert(filter, model);
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
