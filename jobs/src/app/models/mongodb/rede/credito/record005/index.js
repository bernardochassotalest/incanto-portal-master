import _ from 'lodash'
import mongoose from 'mongoose'
import { stringDate } from 'app/lib/utils'
import schema from 'app/models/mongodb/rede/credito/record005/schema'

const getFilterDate = (params) => {
    let from = _.get(params, 'from', ''),
        to = _.get(params, 'to', ''),
        match = _.get(params, 'match', ''),
        reference = _.get(params, 'reference', ''),
        result = {
            'registro': '005',
            'dt_limite': { $gte: stringDate(from), $lte: stringDate(to) }
        };
    return result;
}

const getFilterOthers = (params) => {
    let match = _.get(params, 'match', ''),
        reference = _.get(params, 'reference', ''),
        userTags = _.get(params, 'userTags', ''),
        result = {};
    if (_.isEmpty(match) == false) {
        result['jogo.Code'] = String(match);
    }
    if (_.isEmpty(reference) == false) {
        result['nro_pedido'] = String(reference);
    }
    if (_.isEmpty(userTags) == false) {
        result['tag'] = { $in: userTags };
    }    
    return result;
}

schema.statics.listChargeBack = async function(params) {
    let pipeline = [],
        { pagination } = params,
        { skip, limit } = pagination,
        filterDate = getFilterDate(params),
        filterOthers = getFilterOthers(params),
        project = {
            'tag': { '$arrayElemAt': [ '$details.Summary.Tag', 0 ] },
            'nro_pv': 1,
            'nro_rv': 1,
            'nro_cartao': 1,
            'vl_transacao': 1,
            'dt_transacao': 1,
            'referencia': 1,
            'nro_processo': 1,
            'nro_cv_nsu': 1,
            'nro_autorizacao': 1,
            'tid': { '$arrayElemAt': [ '$details.Summary.Tid', 0 ] },
            'nro_pedido': { '$arrayElemAt': [ '$details.Summary.Reference', 0 ] },
            'cod_request': 1,
            'dt_limite': 1,
            'bandeira': 1,
            'livre': 1,
            'campeonato': { '$arrayElemAt': [ '$details.Summary.Championship', 0 ] },
            'jogo': { '$arrayElemAt': [ '$details.Summary.Match', 0 ] }
        },
        lookup = {
             from: 'c_cldr_summary',
             localField: '_summary_id',
             foreignField: '_id',
             as: 'details'
        },
        csv = (_.upperCase(_.get(params, 'csv', '')) == 'TRUE' ? true : false),
        countSteps = [],
        list = [],
        totals = {},
        count = 0;

    pipeline.push({ $match: filterDate });
    pipeline.push({ $lookup: lookup });
    pipeline.push({ $project: project });
    pipeline.push({ $match: filterOthers });
    if (csv == false) {
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        countSteps = pipeline.slice(0, 4);
        countSteps.push({
            $group : {
                _id : '$__count',
                'total': { $sum: 1 },
                'vl_transacao': { $sum: '$vl_transacao' },
            }
        });
    }

    try {
        list = await this.aggregate(pipeline);
        if (csv == false) {
            let countData = await this.aggregate(countSteps);
            count = _.get(countData, '[0].total', 0);
            totals['vl_transacao'] = _.round(_.get(countData, '[0].vl_transacao', 0), 2);
        }
    } catch (error) {
        throw error
    }

    return { list, 'pagination': { count, skip, limit }, totals }
}

export default mongoose.model('cldr_rede_credito_record005', schema, 'c_cldr_rede_credito')