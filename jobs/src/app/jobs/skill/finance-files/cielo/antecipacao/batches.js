import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const batchRecord = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`cielo-06-${modelId}`),
        vl_bruto = _.get(model, 'vl_bruto_antecipacao', 0),
        vl_liquido = _.get(model, 'vl_liquido_antecipacao', 0),
        vl_taxa = (-1 * _.round(vl_bruto - vl_liquido, 2));

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'cielo');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'liquidacao');
    _.set(result, 'type', 'antecipacao');
    _.set(result, 'plan', _.get(model, 'tipo_plano', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'estabelecimento', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_resumo', ''));
    _.set(result, 'operationNo', _.get(model, 'nro_operacao', ''));
    _.set(result, 'refDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'dueDate', _.get(model, 'dt_vencimento_ro', ''));
    _.set(result, 'payDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', _.get(model, 'nro_parcela', ''));
    _.set(result, 'qtyTransactions', 0);
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', '');
    _.set(result, 'grossAmount', 0);
    _.set(result, 'commission', 0);
    _.set(result, 'netAmount', vl_bruto);
    _.set(result, 'adjustment', 0);
    _.set(result, 'fee', vl_taxa);
    _.set(result, 'settlement', vl_liquido);
    _.set(result, 'sourceDb', 'cldr_cielo_antecipacao');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));
    _.set(result, 'cielo_key_group', _.get(model, 'cielo_key_group', ''));

    return result;
}

export const saveBatches = async (params) => {
    try {
        const { parsed, fileName, broker } = params;
        let generated = [];

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '6') {
                let item = batchRecord(model);
                await broker.publish('incanto.Skill.AcquirerBatch.Post', item);
                generated.push(item);
            }
        }

        params['batches'] = generated;
    } catch (error) {
        throw error;
    }

    return params;
}
