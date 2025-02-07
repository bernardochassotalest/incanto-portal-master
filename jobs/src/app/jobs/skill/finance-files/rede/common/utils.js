import _ from 'lodash'
import { getTransactionKeys } from 'app/jobs/skill/commons/utils'

export const setTidPedido = (idRecord, result, parsed) => {
    let filter = {
            'registro': idRecord,
            '_key': _.get(result, '_key', '')
        },
        record = _.findLast(parsed, filter);
    if (record) {
        record['nro_pedido'] = _.get(result, 'nro_pedido', '')
        record['tid'] = _.get(result, 'tid', '')
        record['_keys'] = getTransactionKeys(parserForKeys(record))
    }
}

export const setCommissionRate = (data) => {
    let vlBruto = _.get(data, 'vl_bruto', 0),
        vlDesconto = _.get(data, 'vl_desconto', 0);

    if ((vlBruto > 0) && (vlDesconto > 0)) {
        let rate = _.round(((vlDesconto/vlBruto) * 100), 2);
        if (_.isNaN(rate) == true) {
            rate = 0;
        }
        _.set(data, 'taxa_comissao', rate);
    }
}

export const parserForKeys = (model) => {
    let result = {},
        nro_pv = _.get(model, 'nro_pv', ''),
        data = _.get(model, 'data', ''),
        nsu = _.get(model, 'nro_cv_nsu', '');

    if (_.isEmpty(nro_pv) == true) {
        nro_pv = _.get(model, 'nro_pv_original', '');
    }
    if (_.isEmpty(data) == true) {
        data = _.get(model, 'dt_rv_original', '');
        if (_.isEmpty(data) == true) {
            data = _.get(model, 'dt_transacao', '');
        }
    }
    if (_.isEmpty(nsu) == true) {
        nsu = _.get(model, 'nro_cv', '');
        if (_.isEmpty(nsu) == true) {
            nsu = _.get(model, 'nro_nsu', '');
        }
    }

    _.set(result, 'BatchGroup', _.get(model, '_resumo_venda'));
    _.set(result, 'PointOfSale', nro_pv);
    _.set(result, 'Date', data);
    _.set(result, 'Nsu', nsu);
    _.set(result, 'Authorization', _.get(model, 'nro_autorizacao', ''));
    _.set(result, 'Tid', _.get(model, 'tid', ''));
    _.set(result, 'Reference', _.get(model, 'nro_pedido', ''));

    return result;
}


