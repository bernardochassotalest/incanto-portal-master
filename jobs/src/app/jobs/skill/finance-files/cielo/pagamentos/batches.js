import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const batchRecord = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`cielo-04-${modelId}`),
        tipo_lancamento = _.get(model, 'tipo_lancamento', ''),
        versaoLayout = _.get(model, 'versao_layout', ''),
        vl_liquido = _.get(model, 'vl_liquido', ''),
        vl_commission = 0, vl_adjustment = 0, vl_net_amount = 0, vl_settlement = vl_liquido;

    if (tipo_lancamento == 'liquidacao') {
        vl_net_amount = vl_liquido;
    } else {
        vl_adjustment = vl_liquido;
    }
    if (versaoLayout < '014') {
      if (tipo_lancamento == 'cancelamento') {
        vl_commission = (-1 * _.get(model, 'vl_comissao', 0))
        vl_settlement += vl_commission;
      }
    }
    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'cielo');
    _.set(result, 'batchGroup', _.get(model, '_resumo_venda', ''));
    _.set(result, 'batchSource', _.get(model, '_resumo_venda', ''));
    _.set(result, 'group', 'liquidacao');
    _.set(result, 'type', tipo_lancamento);
    _.set(result, 'plan', _.get(model, 'tipo_plano', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'estabelecimento', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_resumo', ''));
    _.set(result, 'operationNo', '');
    _.set(result, 'refDate', _.get(model, 'dt_pagamento', ''));
    _.set(result, 'taxDate', _.get(model, 'dt_pagamento', ''));
    _.set(result, 'dueDate', _.get(model, 'dt_pagamento', ''));
    _.set(result, 'payDate', _.get(model, 'dt_pagamento', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'installment', _.get(model, 'nro_parcela', ''));
    _.set(result, 'qtyTransactions', _.get(model, 'qt_cvs_aceitos', 0));
    _.set(result, 'qtyRejections', _.get(model, 'qt_cvs_rejeitados', 0));
    _.set(result, 'bankCode', _.get(model, 'banco', ''));
    _.set(result, 'bankBranch', _.get(model, 'agencia', ''));
    _.set(result, 'bankAccount', _.get(model, 'conta_corrente', ''));
    _.set(result, 'notes', _.get(model, 'origem_ajuste.name', ''));
    _.set(result, 'grossAmount', 0);
    _.set(result, 'commission', vl_commission);
    _.set(result, 'netAmount', vl_net_amount);
    _.set(result, 'adjustment', vl_adjustment);
    _.set(result, 'fee', 0);
    _.set(result, 'settlement', vl_settlement);
    _.set(result, 'rejectAmount', _.get(model, 'vl_rejeitado', 0));
    _.set(result, 'sourceDb', 'cldr_cielo_pagamentos');
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
                  status_lancamento = _.get(model, 'status_lancamento', ''),
                  registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;

            if ((registro == '1') && (status_lancamento == 'pago')) {
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
