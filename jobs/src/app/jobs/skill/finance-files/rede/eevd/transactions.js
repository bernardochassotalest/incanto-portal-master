import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'
import { parserAccounting } from 'app/jobs/skill/finance-files/rede/eevd/accounting'

const transactionRecord = (model, resumos) => {
    let result = [],
        resumo = _.first(resumos),
        modelId = _.get(model, '_id', ''),
        installment = '01/01',
        idT = md5(`rede-eevd-${modelId}`),
        idI = md5(`rede-eevd-${modelId}-${installment}`),
        planType = 'avista',
        grossAmount = _.get(model, 'vl_bruto', 0),
        rate = _.get(model, 'taxa_comissao', 0),
        commission = _.get(model, 'vl_desconto', 0),
        netAmount = _.get(model, 'vl_liquido', 0),
        dataT = {}, dataI = {}, dataG = {};

    _.set(dataT, 'id', idT);
    _.set(dataT, 'acquirer', 'rede');
    _.set(dataT, 'batchGroup', _.get(model, '_keys.BatchGroup', ''));
    _.set(dataT, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(dataT, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(dataT, 'tag', _.get(resumo, 'tag', ''));
    _.set(dataT, 'pointOfSale', _.get(model, 'nro_pv', ''));
    _.set(dataT, 'batchNo', _.get(model, 'nro_rv', ''));
    _.set(dataT, 'saleType', _.get(model, 'tipo_venda', ''));
    _.set(dataT, 'captureDate', _.get(model, 'data', ''));
    _.set(dataT, 'captureTime', _.get(model, 'hora_transacao', ''));
    _.set(dataT, 'grossAmount', grossAmount);
    _.set(dataT, 'rate', rate);
    _.set(dataT, 'commission', commission);
    _.set(dataT, 'netAmount', netAmount);
    _.set(dataT, 'nsu', _.get(model, 'nro_cv', ''));
    _.set(dataT, 'authorization', '');
    _.set(dataT, 'tid', _.get(model, 'tid', ''));
    _.set(dataT, 'reference', _.get(model, 'nro_pedido', ''));
    _.set(dataT, 'cardNumber', _.get(model, 'nro_cartao', ''));
    _.set(dataT, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(dataT, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(dataT, 'captureType', _.get(model, 'tipo_captura.name', ''));
    _.set(dataT, 'terminalNo', _.get(model, 'nro_terminal', ''));
    _.set(dataT, 'sourceDb', 'c_cldr_rede_debito');
    _.set(dataT, 'sourceId', modelId);
    _.set(dataT, 'fileName', _.get(model, 'fileName', ''));
    _.set(dataT, 'fileLine', _.get(model, 'nro_linha', 0));

    _.set(dataI, 'id', idI);
    _.set(dataI, 'transactionId', idT);
    _.set(dataI, 'installment', installment);
    _.set(dataI, 'transType', 'venda');
    _.set(dataI, 'dueDate', _.get(resumo, 'dt_credito', ''));
    _.set(dataI, 'grossAmount', grossAmount);
    _.set(dataI, 'rate', rate);
    _.set(dataI, 'commission', commission);
    _.set(dataI, 'netAmount', netAmount);

    _.set(dataG, 'transaction', dataT)
    _.set(dataG, 'installment', dataI)
    result.push(dataG);

    return result;
}

export const saveTransaction = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '05') {
                const idResumo = _.get(model, '_resumo_venda', ''),
                      filtered = _.filter(parsed, { registro: '01', '_resumo_venda': idResumo }),
                      transactions = transactionRecord(model, filtered);

                await parserAccounting(transactions);
                for (var j = 0; j < transactions.length; j++) {
                    let item = transactions[j];
                    await broker.publish('incanto.Skill.AcquirerTransaction.Post', item);
                }
            }
        }
    } catch (error) {
        throw error;
    }
    return params;
}
