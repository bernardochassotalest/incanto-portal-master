import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const baseRecord = (model, installment, dueDate) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eevc-${modelId}-${installment}`);

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'rede');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'venda');
    _.set(result, 'type', 'venda');
    _.set(result, 'plan', _.get(model, 'tipo_plano', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'nro_pv', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_rv', ''));
    _.set(result, 'operationNo', '');
    _.set(result, 'refDate', _.get(model, 'data', ''));
    _.set(result, 'taxDate', _.get(model, 'data', ''));
    _.set(result, 'dueDate', dueDate);
    _.set(result, 'payDate', '');
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', installment);
    _.set(result, 'qtyTransactions', _.get(model, 'qt_cv_nsu', 0));
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', '');
    _.set(result, 'grossAmount', _.get(model, 'vl_bruto', 0));
    _.set(result, 'rate', _.get(model, 'taxa_comissao', 0));
    _.set(result, 'commission', _.get(model, 'vl_desconto', 0));
    _.set(result, 'netAmount', _.get(model, 'vl_liquido', 0));
    _.set(result, 'adjustment', 0);
    _.set(result, 'fee', 0);
    _.set(result, 'settlement', 0);
    _.set(result, 'rejectAmount', _.get(model, 'vl_rejeitado', 0));
    _.set(result, 'sourceDb', 'cldr_rede_credito');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

const batchRecord006 = (model) => {
    let result = [],
        installment = _.get(model, 'nro_parcela', ''),
        dueDate = _.get(model, 'dt_credito', '');

    result.push(baseRecord(model, installment, dueDate));

    return result;
}

const batchRecord010 = (model, parcelas) => {
    let result = [],
        totalParcelas = sizedField(parcelas.length, 2);

    for (var i = 0; i < parcelas.length; i++) {
        let item = parcelas[i],
            installment = `${item.nro_parcela}/${totalParcelas}`,
            dueDate = _.get(item, 'dt_credito', ''),
            baseParser = baseRecord(model, installment, dueDate);

        _.set(baseParser, 'grossAmount', _.get(item, 'vl_bruto', 0));
        _.set(baseParser, 'rate', _.get(item, 'taxa_comissao', 0));
        _.set(baseParser, 'commission', _.get(item, 'vl_desconto', 0));
        _.set(baseParser, 'netAmount', _.get(item, 'vl_liquido', 0));
        _.set(baseParser, 'rejectAmount', _.get(item, 'vl_rejeitado', 0));

        result.push(baseParser);
    }

    return result;
}

export const saveBatches = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            let model = parsed[i], batches = [],
                idResumo = _.get(model, '_resumo_venda', ''),
                registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '006') {
                batches = batchRecord006(model);
            } else if (registro == '010') {
                const filtered = _.filter(parsed, { registro: '014', '_resumo_venda': idResumo });
                batches = batchRecord010(model, filtered);
            }
            for (var j = 0; j < batches.length; j++) {
                await broker.publish('incanto.Skill.AcquirerBatch.Post', batches[j])
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
