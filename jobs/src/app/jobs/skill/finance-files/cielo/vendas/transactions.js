import _ from 'lodash';
import { md5, sizedField } from 'app/lib/utils';
import { parserAccounting } from 'app/jobs/skill/finance-files/cielo/vendas/accounting';
import fs from "fs";

const transactionRecord = (model, resumos) => {
    let result = [],
        totalParcelas = _.get(model, 'total_parcela', '01'),
        qtParcelas = _.toInteger(totalParcelas);

    if (qtParcelas <= 0) {
        totalParcelas = '01'; qtParcelas = 1;
    }

    for (let i = 0; i < qtParcelas; i++) {
        let resumo = resumos[i],
            modelId = _.get(model, '_id', ''),
            nrParcela = sizedField(i + 1, 2),
            installment = `${nrParcela}/${totalParcelas}`,
            idT = md5(`cielo-03-${modelId}`),
            idI = md5(`cielo-03-venda-${modelId}-${installment}`),
            planType = _.get(resumo, 'tipo_plano', ''),
            grossAmount = _.get(model, 'vl_transacao', 0),
            rate = _.get(model, 'taxa_comissao', 0),
            commission = _.get(model, 'vl_comissao', 0),
            netAmount = _.get(model, 'vl_liquido', 0),
            dataT = {}, dataI = {}, dataG = {};

        if (planType === 'parcelado') {
            if (nrParcela === '01') {
                grossAmount = _.get(model, 'vl_parcela', 0);
            } else {
                grossAmount = _.get(model, 'vl_proxima_parcela', 0);
            }
            commission = _.round((grossAmount * rate) / 100, 2);
            netAmount = _.round(grossAmount - commission, 2);
        }
        _.set(dataT, 'id', idT);
        _.set(dataT, 'acquirer', 'cielo');
        _.set(dataT, 'batchGroup', _.get(model, '_keys.BatchGroup', ''));
        _.set(dataT, 'keyNsu', _.get(model, '_keys.Nsu', ''));
        _.set(dataT, 'keyTid', _.get(model, '_keys.Tid', ''));
        // _.set(dataT, 'tag', _.get(resumo, 'tag', ''));
        _.set(dataT, 'tag', _.get(model, 'tag', ''));
        _.set(dataT, 'pointOfSale', _.get(model, 'estabelecimento', ''));
        _.set(dataT, 'batchNo', _.get(model, 'nro_resumo', ''));
        // _.set(dataT, 'saleType', _.get(model, 'tipo_produto.kind', '')); /** versão antiga */
        _.set(dataT, 'saleType', _.get(model, 'tipo_liquidacao.kind', ''));
        // _.set(dataT, 'captureDate', _.get(model, 'dt_apresentacao', ''));
        _.set(dataT, 'captureDate', _.get(model, 'dt_captura', ''));
        _.set(dataT, 'captureTime', _.get(model, 'hr_transacao', ''));
        _.set(dataT, 'grossAmount', _.get(model, 'vl_transacao', ''));
        _.set(dataT, 'rate', _.get(model, 'taxa_comissao', ''));
        _.set(dataT, 'commission', _.get(model, 'vl_comissao', ''));
        _.set(dataT, 'netAmount', _.get(model, 'vl_liquido', ''));
        _.set(dataT, 'nsu', _.get(model, 'nro_nsu_doc', ''));
        _.set(dataT, 'authorization', _.get(model, 'cod_autorizacao', ''));
        _.set(dataT, 'tid', _.get(model, 'tid', ''));
        _.set(dataT, 'reference', _.get(model, 'nro_pedido', ''));
        _.set(dataT, 'cardNumber', _.get(model, 'nro_cartao', ''));
        _.set(dataT, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
        _.set(dataT, 'cardBrandName', _.get(model, 'bandeira.name', ''));
        _.set(dataT, 'captureType', _.get(model, 'meio_captura.name', ''));
        _.set(dataT, 'terminalNo', _.get(model, 'nro_terminal', ''));
        _.set(dataT, 'sourceDb', 'cldr_cielo_vendas');
        _.set(dataT, 'sourceId', modelId);
        _.set(dataT, 'fileName', _.get(model, 'fileName', ''));
        _.set(dataT, 'fileLine', _.get(model, 'nro_linha', 0));

        _.set(dataI, 'id', idI);
        _.set(dataI, 'transactionId', idT);
        _.set(dataI, 'installment', installment);
        _.set(dataI, 'transType', 'venda');
        // _.set(dataI, 'dueDate', _.get(resumo, 'dt_pagamento', ''));
        _.set(dataI, 'dueDate', _.get(model, 'dt_vencimento_original', ''));
        _.set(dataI, 'grossAmount', grossAmount);
        _.set(dataI, 'rate', rate);
        _.set(dataI, 'commission', commission);
        _.set(dataI, 'netAmount', netAmount);

        _.set(dataG, 'transaction', dataT)
        _.set(dataG, 'installment', dataI)
        result.push(dataG);
    }

    return result;
}

const rejectionRecord = (model, resumos) => {
    let result = {},
        resumo = _.first(resumos),
        modelId = _.get(model, '_id', ''),
        id = md5(`cielo-03-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'acquirer', 'cielo');
    _.set(result, 'batchGroup', _.get(model, '_keys.BatchGroup', ''));
    _.set(result, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(result, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(result, 'tag', _.get(resumo, 'tag', ''));
    _.set(result, 'pointOfSale', _.get(model, 'estabelecimento', ''));
    _.set(result, 'batchNo', _.get(model, 'nro_resumo', ''));
    _.set(result, 'saleType', _.get(model, 'tipo_produto.kind', ''));
    _.set(result, 'captureDate', _.get(model, 'dt_apresentacao', ''));
    _.set(result, 'captureTime', _.get(model, 'hr_transacao', ''));
    _.set(result, 'grossAmount', _.get(model, 'vl_transacao', ''));
    _.set(result, 'rate', _.get(model, 'taxa_comissao', ''));
    _.set(result, 'commission', _.get(model, 'vl_comissao', ''));
    _.set(result, 'netAmount', _.get(model, 'vl_liquido', ''));
    _.set(result, 'nsu', _.get(model, 'nro_nsu_doc', ''));
    _.set(result, 'authorization', _.get(model, 'cod_autorizacao', ''));
    _.set(result, 'tid', _.get(model, 'tid', ''));
    _.set(result, 'reference', _.get(model, 'nro_pedido', ''));
    _.set(result, 'cardNumber', _.get(model, 'nro_cartao', ''));
    _.set(result, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(result, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(result, 'rejectionCode', _.get(model, 'motivo_rejeicao.code', ''));
    _.set(result, 'rejectionName', _.get(model, 'motivo_rejeicao.name', ''));
    _.set(result, 'captureType', _.get(resumo, 'meio_captura.name', ''));
    _.set(result, 'terminalNo', _.get(model, 'nro_terminal', ''));
    _.set(result, 'sourceDb', 'cldr_cielo_vendas');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'saleId', '');
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveTransaction = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        const list = [];
        const rejList = [];

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                cielo_key_group = _.get(model, 'cielo_key_group', ''),
                status_lancamento = _.get(model, 'status_lancamento', ''),
                filtered = _.sortBy(_.filter(parsed, { registro: '1', cielo_key_group }), 'nro_parcela'),
                registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if ((registro == '2' || registro == 'E') && (status_lancamento == 'capturado')) {
                let transactions = transactionRecord(model, filtered);

                await parserAccounting(transactions);
                for (var j = 0; j < transactions.length; j++) {
                    let item = transactions[j];
                    await broker.publish('incanto.Skill.AcquirerTransaction.Post', item);
                    list.push(item);
                }
            } else if ((registro == '2' || registro == 'E') && (status_lancamento == 'rejeitado')) {
                let rejected = await rejectionRecord(model, filtered);
                rejList.push(rejected);
                await broker.publish('incanto.Skill.AcquirerRejection.Post', rejected);
            }
        }
        // console.log(list, 'list');
        // const file = './transactions15.json';
        // const filerej = './rejections15.json';
        // fs.writeFileSync(file, JSON.stringify(list, '', 2), 'utf-8');
        // fs.writeFileSync(filerej, JSON.stringify(rejList, '', 2), 'utf-8');
    } catch (error) {
        throw error;
    }

    return params;
}
