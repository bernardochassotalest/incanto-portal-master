import _ from 'lodash'
import mongoose from 'mongoose'
import { stringDate } from 'app/lib/utils'
import schema from 'app/models/mongodb/itau/extrato/genneral/schema'

const getFilter = (params) => {
    let from = _.get(params, 'from', ''),
        to = _.get(params, 'to', ''),
        onlyCard = _.get(params, 'onlycard', ''),
        account = _.get(params, 'account', ''),
        acquirer = _.get(params, 'acquirer', ''),
        result = {
            'registro': '3',
            'data_lancamento': { $gte: stringDate(from), $lte: stringDate(to) }
        };

    if (_.toUpper(onlyCard) == 'TRUE') {
        result['cod_fluxo_caixa.code'] = '0093';
    }
    if (_.isEmpty(account) == false) {
        result['conta_corrente'] = account;
    }
    if (_.isEmpty(acquirer) == false) {
        result['adquirente.code'] = acquirer;
    }
    return result;
}

schema.statics.listDetails = async function(params) {
    params['onlycard'] = 'true';
    let { pagination } = params,
        { skip, limit } = pagination,
        filter = getFilter(params),
        fields = {
            'conta_corrente': 1,
            'natureza_lancamento': 1,
            'data_lancamento': 1,
            'valor_lancamento': 1,
            'valor_saldo': 1,
            'tipo_lancamento': 1,
            'categoria_lancamento': 1,
            'cod_fluxo_caixa': 1,
            'desc_historico': 1,
            'adquirente': 1,
            'ponto_venda': 1,
        },
        list = [],
        count = 0;

    try {
        list = await this.find(filter, fields)
                         .sort('data_lancamento')
                         .skip(skip)
                         .limit(limit),
        count = await this.countDocuments(filter)
    } catch (error) {
        throw error
    }

    return { list, 'pagination': { count, skip, limit } }
}

schema.statics.listDashboard = async function(params) {
    params['onlycard'] = 'true';
    let { pagination } = params,
        { skip, limit } = pagination,
        pipeline = [],
        filter = getFilter(params),
        group = {
            '_id': '$adquirente',
            'quantity': { $sum: 1 },
            'value': { $sum: '$valor_saldo' }
        },
        project = {
            '_id': 0,
            'category': 'Adquirentes',
            'filter': {
                'name': 'acquirer',
                'value': '$_id.code'
            },
            'description': '$_id.name',
            'quantity': 1,
            'value': 1
        },
        cards = [];

    pipeline.push({ $match: filter });
    pipeline.push({ $group: group });
    pipeline.push({ $project: project });

    try {
        cards = await this.aggregate(pipeline);
    } catch (error) {
        throw error
    }

    return { cards }
}

schema.statics.listCsv = async function(params) {
    let pipeline = [],
        filter = getFilter(params),
        project = {
            'lote': '$lote',
            'nr_sequencial': '$nr_sequencial',
            'banco': '$banco',
            'agencia': '$agencia',
            'dig_agencia': '$dig_agencia',
            'conta_corrente': '$conta_corrente',
            'dig_conta_corrente': '$dig_conta_corrente',
            'data_lancamento': '$data_lancamento',
            'valor_lancamento': '$valor_lancamento',
            'tipo_lancamento': '$tipo_lancamento',
            'desc_historico': '$desc_historico',
            'categoria': '$categoria_lancamento.name',
            'fluxo_caixa': '$cod_fluxo_caixa.name',
            'adquirente': '$adquirente.name',
            'ponto_venda': '$ponto_venda',
        },
        sort = {
            'data_lancamento': 1,
            'lote': 1,
            'nr_sequencial': 1
        },
        list = [];

    pipeline.push({ $match: filter });
    pipeline.push({ $project: project });
    pipeline.push({ $sort: sort });

    try {
        list = await this.aggregate(pipeline);
    } catch (error) {
        throw error
    }

    return { list }
}


export default mongoose.model('cldr_itau_extrato', schema, 'c_cldr_itau_extrato')