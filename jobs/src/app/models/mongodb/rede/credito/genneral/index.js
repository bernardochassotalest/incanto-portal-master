import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/rede/credito/genneral/schema'

schema.statics.listByResumo = async function(idResumo) {
    var result = [],
        pipeline = [],
        filter = {
            '_resumo_venda': idResumo
        },
        project = {
            'nro_pv': 1,
            'data': 1,
            'vl_bruto': 1,
            'nro_parcelas': 1,
            'nro_cv_nsu': 1,
            'nro_autorizacao': 1,
            'tid': 1,
            'nro_pedido': 1,
            'vl_desconto': 1,
            'vl_liquido': 1,
            'vl_primeira_parcela': 1,
            'vl_demais_parcelas': 1,
            'bandeira': 1,
        };

    pipeline.push({ $match: filter });
    pipeline.push({ $project: project });

    try {
        result = await this.aggregate(pipeline);
    } catch (error) {
        throw error
    }

    return result;
}

export default mongoose.model('cldr_rede_credito_genneral', schema, 'c_cldr_rede_credito')
