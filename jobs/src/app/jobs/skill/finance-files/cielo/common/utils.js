import _ from 'lodash'
import { md5 } from 'app/lib/utils'
import { getIdTable } from 'app/jobs/skill/finance-files/cielo/common/tables'

export const createKeyGroup = (lines) => {
    var inverted = [];
    for (var i = lines.length - 1; i >= 0; i--) {
        var line = lines[i];

        if (_.isEmpty(line) == false) {
            inverted.push(line.substr(0, line.length));
        }
    }

    var newFile = [],
        dataBlock = [],
        nro_ro_unico_header = '',
        nro_ro_unico_line = '';
    for (var i = 0; i < inverted.length; i++) {
        var line = inverted[i],
            record = line.substr(0, 1);

        if (record == '9') {
            var idBloco = md5(line);
            newFile.unshift(line + idBloco);
        }
        else if (record == '5') {
            var idBloco = md5(line);
            newFile.unshift(line + idBloco);
        }
        else if (record == '3') {
            var idBloco = md5(line);
            newFile.unshift(line + idBloco);
        }
        else if (record == '2') {
            dataBlock.push(line);
            nro_ro_unico_line = line.substr(188, 15);
        }
        else if (record == 'E') {
            dataBlock.push(line);
            nro_ro_unico_line = line.substr(129, 22);
        }
        else if ((record == '1') || (record == '6') || (record == '7')) {
            dataBlock.push(line);

            var novoBloco = false;
            if (line.substr(20, 1) == '/') {
                nro_ro_unico_header = line.substr(187, 15);
                if (nro_ro_unico_header == nro_ro_unico_line) {
                    novoBloco = true;
                }
            } else {
                novoBloco = true;
            }

            if (novoBloco == true) {
                var idBloco = md5(_.join(dataBlock));
                for (var j = 0; j < dataBlock.length; j++) {
                    dataBlock[j] = dataBlock[j] + idBloco;
                    newFile.unshift(dataBlock[j]);
                }
                dataBlock = [];
                nro_ro_unico_header = '';
                nro_ro_unico_line = '';
            }
        }
        if (record == '0') {
            var idBloco = md5(line);
            newFile.unshift(line + idBloco);
        }
    }

    return newFile;  
};

export const parserForKeys = (model) => {
    let result = {};

    _.set(result, 'BatchGroup', _.get(model, '_resumo_venda'));
    _.set(result, 'PointOfSale', _.get(model, 'estabelecimento', ''));
    _.set(result, 'Date', _.get(model, 'dt_venda_ajuste', ''));
    _.set(result, 'Nsu', _.get(model, 'nro_nsu_doc', ''));
    _.set(result, 'Authorization', _.get(model, 'cod_autorizacao', ''));
    _.set(result, 'Tid', _.get(model, 'tid', ''));
    _.set(result, 'Reference', _.get(model, 'nro_pedido', ''));

    return result;
}

export const parserRecord0 = (params) => {
    let result = {},
        { line, lineNumber } = params;

    _.set(result, '_id', md5(line));
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))    
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'estabelecimento_matriz', _.trim(line.substr(1, 10)))
    _.set(result, 'dt_arquivo', line.substr(11, 4) + '-' + line.substr(15, 2) + '-' + line.substr(17, 2))
    _.set(result, 'periodo_inicial', line.substr(19, 4) + '-' + line.substr(23, 2) + '-' + line.substr(25, 2))
    _.set(result, 'periodo_final', line.substr(27, 4) + '-' + line.substr(31, 2) + '-' + line.substr(33, 2))
    _.set(result, 'nro_sequencial', _.trim(line.substr(35, 7)))
    _.set(result, 'adquirente', _.trim(line.substr(42, 5)))
    _.set(result, 'opcao_extrato', getIdTable('opcao_extrato', _.trim(line.substr(47, 2))))
    _.set(result, 'van', getIdTable('van', _.trim(line.substr(49, 1))))
    _.set(result, 'caixa_postal', _.trim(line.substr(50, 20)))
    _.set(result, 'versao_layout', _.trim(line.substr(70, 3)))
    _.set(result, 'uso_cielo', _.trim(line.substr(73, 177)))
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);

    return result;
};

export const parserRecord9 = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'total_registro', Number(_.trim(line.substr(1, 11))))
    _.set(result, 'sinal_liquido', _.trim(line.substr(12, 1)))
    _.set(result, 'vl_liquido', (Number(line.substr(13, 17)) / 100))
    _.set(result, 'qt_transacoes', Number(_.trim(line.substr(30, 11))))
    _.set(result, 'uso_cielo', _.trim(line.substr(41, 209)))
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    if (result.sinal_liquido == '-') {
        result['vl_liquido'] = (-1 * result['vl_liquido']);
    }
    params.totals.qtd_file += result.total_registro;
    params.totals.vl_file += result.vl_liquido;

    return result;
};

export const parserRecordX = (params) => {
    let result = {},
        { line, fileKey, fileType, lineNumber } = params;

    _.set(result, '_id', md5(fileKey + '-' + line));
    _.set(result, 'tipo_arquivo', _.get(params, 'fileType', ''))
    _.set(result, 'registro', line.substr(0, 1))
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'info', line.substr(1, (line.length-1)))
    _.set(result, 'cielo_key_group', _.trim(line.substr(line.length-32, 32)))
    _.set(result, 'id_arquivo', params.fileId);
    params.totals.qtd_records += 1;

    return result;
};
