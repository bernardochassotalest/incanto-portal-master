import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const baseRecord = (model, type) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eevd-${modelId}-${type}`);

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
    _.set(result, 'refDate', _.get(model, 'dt_rv', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_rv', ''));
    _.set(result, 'dueDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'payDate', '');
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', _.get(model, 'nro_parcela', ''));
    _.set(result, 'qtyTransactions', _.get(model, 'qtd_cv', 0));
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
    _.set(result, 'sourceDb', 'cldr_rede_debito');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

const batchRecord01 = (model) => {
    let result = [],
        baseParser = baseRecord(model, 'liquidacao');

    _.set(baseParser, 'group', 'liquidacao');
    _.set(baseParser, 'type', 'liquidacao');
    _.set(baseParser, 'refDate', _.get(model, 'dt_credito', ''));
    _.set(baseParser, 'taxDate', _.get(model, 'dt_credito', ''));
    _.set(baseParser, 'payDate', _.get(model, 'dt_credito', ''));
    _.set(baseParser, 'grossAmount', 0);
    _.set(baseParser, 'commission', 0);
    _.set(baseParser, 'netAmount', _.get(model, 'vl_liquido', 0));
    _.set(baseParser, 'adjustment', 0);
    _.set(baseParser, 'fee', 0);
    _.set(baseParser, 'settlement', _.get(model, 'vl_liquido', 0));

    result.push(baseRecord(model, 'venda'));
    result.push(baseParser);

    return result;
}

const batchRecord011 = (model) => {
    let result = [], content = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eevd-${modelId}-ajustes`),
        fator = (_.get(model, 'tipo_ajuste.code', '') == 'D' ? -1 : 1),
        vl_ajuste = (fator * _.get(model, 'vl_ajuste', 0));

    _.set(content, 'id', id);
    _.set(content, 'acquirer', 'rede');
    _.set(content, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(content, 'batchSource', _.get(model, '_resumo_original', ''));
    _.set(content, 'group', 'liquidacao');
    _.set(content, 'type', _.get(model, 'tipo_lancamento', ''));
    _.set(content, 'plan', _.get(model, 'tipo_plano', ''));
    _.set(content, 'tag', _.get(model, 'tag', ''));
    _.set(content, 'pointOfSale', _.get(model, 'nro_pv_ajustado', ''));
    _.set(content, 'batchNo', _.get(model, 'nro_rv_ajustado', ''));
    _.set(content, 'operationNo', _.get(model, 'nro_ordem_debito', ''));
    _.set(content, 'refDate', _.get(model, 'dt_credito', ''));
    _.set(content, 'taxDate', _.get(model, 'dt_credito', ''));
    _.set(content, 'dueDate', _.get(model, 'dt_credito', ''));
    _.set(content, 'payDate', _.get(model, 'dt_credito', ''));
    _.set(content, 'cardBrandCode', _.get(model, 'bandeira_rv_ajustado.code', ''));
    _.set(content, 'cardBrandName', _.get(model, 'bandeira_rv_ajustado.name', ''));
    _.set(content, 'installment', _.get(model, 'nro_parcela', ''));
    _.set(content, 'qtyTransactions', 1);
    _.set(content, 'bankCode', _.get(model, 'banco', ''));
    _.set(content, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(content, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(content, 'notes', _.get(model, 'motivo_ajuste_desc', ''));
    _.set(content, 'grossAmount', 0);
    _.set(content, 'rate', 0);
    _.set(content, 'commission', 0);
    _.set(content, 'netAmount', 0);
    _.set(content, 'adjustment', vl_ajuste);
    _.set(content, 'fee', 0);
    _.set(content, 'settlement', vl_ajuste);
    _.set(content, 'sourceDb', 'cldr_rede_debito');
    _.set(content, 'sourceId', modelId);
    _.set(content, 'fileName', _.get(model, 'fileName', ''));
    _.set(content, 'fileLine', _.get(model, 'nro_linha', 0));
    _.set(content, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    result.push(content);

    return result;
}

export const saveBatches = async (params) => {
    try {
        const { parsed, fileName, broker } = params;
        let generated = [];

        for (var i = 0; i < parsed.length; i++) {
            let model = parsed[i], batches = [],
                idResumo = _.get(model, '_resumo_venda', ''),
                registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '01') {
                batches = batchRecord01(model);
            } else if (registro == '011') {
                batches = batchRecord011(model);
            }
            for (var j = 0; j < batches.length; j++) {
                let item = batches[j];
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
