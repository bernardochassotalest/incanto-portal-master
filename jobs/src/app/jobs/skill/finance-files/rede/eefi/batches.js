import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const baseRecord = (model, idRecord) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        installment = _.get(model, 'nro_parcela', '01/01'),
        type = (idRecord == '036' ? 'antecipacao' : 'liquidacao'),
        id = md5(`rede-eefi-${modelId}-${installment}`),
        vl_a_receber = _.get(model, 'vl_a_receber', 0),
        vl_lancamento = _.get(model, 'vl_lancamento', 0),
        vl_credito = _.get(model, 'vl_credito', 0),
        vl_taxa_antecipacao = _.round(vl_credito - vl_lancamento, 2);

    if (_.isEmpty(installment) == true) {
        installment = '01/01';
    }
    if (vl_taxa_antecipacao < 0) {
        vl_taxa_antecipacao = 0;
    }

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'rede');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'liquidacao');
    _.set(result, 'type', type);
    _.set(result, 'plan', _.get(model, 'tipo_plano', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'nro_pv_original', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_rv', ''));
    _.set(result, 'operationNo', _.get(model, 'nro_documento', ''));
    _.set(result, 'refDate', _.get(model, 'dt_lancamento', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_lancamento', ''));
    _.set(result, 'dueDate',  _.get(model, 'dt_lancamento', ''));
    _.set(result, 'payDate', _.get(model, 'dt_lancamento', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', installment);
    _.set(result, 'qtyTransactions', 0);
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', '');
    _.set(result, 'grossAmount', 0);
    _.set(result, 'rate', 0);
    _.set(result, 'commission', 0);
    _.set(result, 'netAmount', vl_a_receber);
    _.set(result, 'adjustment', 0);
    _.set(result, 'fee', (-1 * vl_taxa_antecipacao));
    _.set(result, 'settlement', vl_lancamento);
    _.set(result, 'sourceDb', 'cldr_rede_financeiro');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

const batchRecord034 = (model) => {
    return baseRecord(model, '034');
}

const batchRecord036 = (model) => {
    return baseRecord(model, '036');
}

const batchRecord035 = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eefi-${modelId}`),
        tipo_lancamento = _.get(model, 'tipo_lancamento', ''),
        fator = (_.get(model, 'tipo_ajuste.code', '') == 'D' ? -1 : 1),
        vl_ajuste = _.get(model, 'vl_ajuste', 0),
        vl_cancelamento = _.get(model, 'vl_cancelamento', 0),
        vl_adjustment = (fator * vl_ajuste),
        vl_commission = 0;

    if (tipo_lancamento == 'cancelamento') {
      vl_commission = (fator * _.round(vl_cancelamento - vl_ajuste, 2));
    }

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'rede');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_original', ''));
    _.set(result, 'group', 'liquidacao');
    _.set(result, 'type', tipo_lancamento);
    _.set(result, 'plan', 'rotativo');
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'nro_pv_ajustado', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_rv_ajustado', ''));
    _.set(result, 'operationNo', _.get(model, 'nro_ordem_debito', ''));
    _.set(result, 'refDate', _.get(model, 'dt_lancamento', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_lancamento', ''));
    _.set(result, 'dueDate',  _.get(model, 'dt_ajuste', ''));
    _.set(result, 'payDate', _.get(model, 'dt_lancamento', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira_rv_ajustado.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira_rv_ajustado.name', ''));
    _.set(result, 'installment', '01/01');
    _.set(result, 'qtyTransactions', 0);
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', _.get(model, 'motivo_ajuste_desc', ''));
    _.set(result, 'grossAmount', 0);
    _.set(result, 'rate', 0);
    _.set(result, 'commission', vl_commission);
    _.set(result, 'netAmount', 0);
    _.set(result, 'adjustment', vl_adjustment);
    _.set(result, 'fee', 0);
    _.set(result, 'settlement', 0);
    _.set(result, 'sourceDb', 'cldr_rede_financeiro');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));
    _.set(result, 'keyNsu', _.get(model, '_keys.Nsu', ''));

    return result;
}

const batchRecord038 = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eefi-${modelId}`),
        fator = (_.get(model, 'tipo_ajuste.code', '') == 'D' ? -1 : 1),
        vl_ajuste = (fator * _.get(model, 'vl_debito', 0));

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'rede');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'liquidacao');
    _.set(result, 'type', _.get(model, 'tipo_lancamento', ''));
    _.set(result, 'plan', 'rotativo');
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'nro_pv', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_rv_original', ''));
    _.set(result, 'operationNo', _.get(model, 'nro_documento', ''));
    _.set(result, 'refDate', _.get(model, 'dt_debito', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_debito', ''));
    _.set(result, 'dueDate',  _.get(model, 'dt_debito', ''));
    _.set(result, 'payDate', _.get(model, 'dt_debito', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira_rv_origem.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira_rv_origem.name', ''));
    _.set(result, 'installment', '01/01');
    _.set(result, 'qtyTransactions', 0);
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', _.get(model, 'motivo_debito_desc', ''));
    _.set(result, 'grossAmount', 0);
    _.set(result, 'rate', 0);
    _.set(result, 'commission', 0);
    _.set(result, 'netAmount', 0);
    _.set(result, 'adjustment', vl_ajuste);
    _.set(result, 'fee', 0);
    _.set(result, 'settlement', vl_ajuste);
    _.set(result, 'sourceDb', 'cldr_rede_financeiro');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

const batchRecord043 = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eefi-${modelId}`),
        vl_ajuste = _.get(model, 'vl_credito', 0);

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'rede');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'liquidacao');
    _.set(result, 'type', 'ajuste_a_credito');
    _.set(result, 'plan', 'avista');
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'nro_pv', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_rv', ''));
    _.set(result, 'operationNo', _.get(model, 'nro_documento', ''));
    _.set(result, 'refDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'dueDate',  _.get(model, 'dt_credito', ''));
    _.set(result, 'payDate', _.get(model, 'dt_credito', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', '01/01');
    _.set(result, 'qtyTransactions', 0);
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', _.get(model, 'motivo_credito_desc', ''));
    _.set(result, 'grossAmount', 0);
    _.set(result, 'rate', 0);
    _.set(result, 'commission', 0);
    _.set(result, 'netAmount', 0);
    _.set(result, 'adjustment', vl_ajuste);
    _.set(result, 'fee', 0);
    _.set(result, 'settlement', vl_ajuste);
    _.set(result, 'sourceDb', 'cldr_rede_financeiro');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveBatches = async (params) => {
    try {
        const { parsed, fileName, broker } = params;
        let generated = [];

        for (var i = 0; i < parsed.length; i++) {
            let model = parsed[i], batches = [],
                registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '034') {
                let parsed034 = batchRecord034(model);
                await broker.publish('incanto.Skill.AcquirerBatch.Post', parsed034);
                generated.push(parsed034);
            } else if (registro == '036') {
                let parsed036 = batchRecord036(model);
                await broker.publish('incanto.Skill.AcquirerBatch.Post', parsed036);
                generated.push(parsed036);
            } else if (registro == '035') {
                let parsed035 = batchRecord035(model);
                await broker.publish('incanto.Skill.AcquirerBatch.Post', parsed035);
                generated.push(parsed035);
            } else if (registro == '038') {
                let parsed038 = batchRecord038(model);
                await broker.publish('incanto.Skill.AcquirerBatch.Post', parsed038);
                generated.push(parsed038);
            } else if (registro == '043') {
                let parsed043 = batchRecord043(model);
                await broker.publish('incanto.Skill.AcquirerBatch.Post', parsed043);
                generated.push(parsed043);
            }
        }

        params['batches'] = generated;
    } catch (error) {
        throw error;
    }

    return params;
}
