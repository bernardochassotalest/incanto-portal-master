import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const batchRecord = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`cielo-09-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'cielo');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'saldo');
    _.set(result, 'type', 'saldo_inicial');
    _.set(result, 'plan', _.get(model, 'tipo_plano', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'estabelecimento', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_resumo', ''));
    _.set(result, 'operationNo', '');
    _.set(result, 'refDate', _.get(model, 'dt_apresentacao', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_apresentacao', ''));
    _.set(result, 'dueDate', _.get(model, 'dt_pagamento', ''));
    _.set(result, 'payDate', '');
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', _.get(model, 'nro_parcela', ''));
    _.set(result, 'qtyTransactions', 0);
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', '');
    _.set(result, 'grossAmount', _.get(model, 'vl_bruto', 0));
    _.set(result, 'rate', _.get(model, 'taxa_comissao', 0));
    _.set(result, 'commission', _.get(model, 'vl_comissao', 0));
    _.set(result, 'netAmount', _.get(model, 'vl_liquido', 0));
    _.set(result, 'adjustment', 0);
    _.set(result, 'fee', 0);
    _.set(result, 'settlement', 0);
    _.set(result, 'sourceDb', 'cldr_cielo_saldos');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveBatches = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '1') {
                await broker.publish('incanto.Skill.AcquirerBatch.Post', batchRecord(model));
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
