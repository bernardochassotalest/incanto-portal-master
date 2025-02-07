import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'

const disputeRecord = (model, resumos) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        id = md5(`rede-eevc-${modelId}`),
        requestName = _.get(model, 'cod_request.name', ''),
        requestDocs = _.get(model, 'cod_request.documents', '');

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'rede');
    _.set(result, 'batchGroup', _.get(model, '_keys.BatchGroup', ''));
    _.set(result, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(result, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'nro_pv', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_rv', ''));
    _.set(result, 'saleDate', _.get(model, 'dt_transacao', ''));
    _.set(result, 'endDate', _.get(model, 'dt_limite', ''));
    _.set(result, 'processNo', _.get(model, 'nro_processo', ''));
    _.set(result, 'reference', _.get(model, 'referencia', ''));
    _.set(result, 'nsu', _.get(model, 'nro_cv_nsu', ''));
    _.set(result, 'authorization', _.get(model, 'nro_autorizacao', ''));
    _.set(result, 'tid', _.get(model, 'tid', ''));
    _.set(result, 'amount', _.get(model, 'vl_transacao', 0));
    _.set(result, 'cardNumber', _.get(model, 'nro_cartao', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'notes', `${requestName} -> ${requestDocs}`);
    _.set(result, 'sourceDb', 'c_cldr_rede_credito');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveDisputes = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '005') {
                const idResumo = _.get(model, '_resumo_venda', ''),
                      filtered = _.filter(parsed, { registro: '01', '_resumo_venda': idResumo });

                await broker.publish('incanto.Skill.AcquirerDispute.Post', disputeRecord(model, filtered));
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
