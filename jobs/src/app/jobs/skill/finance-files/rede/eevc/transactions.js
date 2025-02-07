import _ from 'lodash'
import { md5, sizedField } from 'app/lib/utils'
import { parserAccounting } from 'app/jobs/skill/finance-files/rede/eevc/accounting'

const ACCEPTED_CV = '000';

const baseRecord = (model, tag) => {
    let modelId = _.get(model, '_id', ''),
        id = md5(`rede-eevc-${modelId}`),
        grossAmount = _.get(model, 'vl_bruto', 0),
        rate = _.get(model, 'taxa_comissao', 0),
        commission = _.get(model, 'vl_desconto', 0),
        netAmount = _.get(model, 'vl_liquido', 0),
        data = {};

    _.set(data, 'id', id);
    _.set(data, 'acquirer', 'rede');
    _.set(data, 'batchGroup', _.get(model, '_keys.BatchGroup', ''));
    _.set(data, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(data, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(data, 'tag', tag);
    _.set(data, 'pointOfSale', _.get(model, 'nro_pv', ''));
    _.set(data, 'batchNo', _.get(model, 'nro_rv', ''));
    _.set(data, 'saleType', _.get(model, 'tipo_venda', ''));
    _.set(data, 'captureDate', _.get(model, 'data', ''));
    _.set(data, 'captureTime', _.get(model, 'hora_transacao', ''));
    _.set(data, 'grossAmount', grossAmount);
    _.set(data, 'rate', rate);
    _.set(data, 'commission', commission);
    _.set(data, 'netAmount', netAmount);
    _.set(data, 'nsu', _.get(model, 'nro_cv_nsu', ''));
    _.set(data, 'authorization', _.get(model, 'nro_autorizacao', ''));
    _.set(data, 'tid', _.get(model, 'tid', ''));
    _.set(data, 'reference', _.get(model, 'nro_pedido', ''));
    _.set(data, 'cardNumber', _.get(model, 'nro_cartao', ''));
    _.set(data, 'cardBrandCode', _.get(model, 'bandeira.code', ''));
    _.set(data, 'cardBrandName', _.get(model, 'bandeira.name', ''));
    _.set(data, 'captureType', _.get(model, 'tipo_captura.name', ''));
    _.set(data, 'terminalNo', _.get(model, 'nro_terminal', ''));
    _.set(data, 'sourceDb', 'c_cldr_rede_credito');
    _.set(data, 'sourceId', modelId);
    _.set(data, 'fileName', _.get(model, 'fileName', ''));
    _.set(data, 'fileLine', _.get(model, 'nro_linha', 0));

    return data;
}

const transactionRecord008 = (model, resumos) => {
    let result = [],
        resumo = _.first(resumos),
        tag = _.get(resumo, 'tag', ''),
        installment = '01/01',
        dueDate = _.get(resumo, 'dt_credito', ''),
        dataT = baseRecord(model, tag),
        dataI = {}, dataG = {},
        idI = md5(`${dataT.id}-${installment}`);

    _.set(dataI, 'id', idI);
    _.set(dataI, 'transactionId', _.get(dataT, 'id', ''));
    _.set(dataI, 'installment', installment);
    _.set(dataI, 'transType', 'venda');
    _.set(dataI, 'dueDate', dueDate);
    _.set(dataI, 'grossAmount', _.get(dataT, 'grossAmount', 0));
    _.set(dataI, 'rate', _.get(dataT, 'rate', 0));
    _.set(dataI, 'commission', _.get(dataT, 'commission', 0));
    _.set(dataI, 'netAmount', _.get(dataT, 'netAmount', 0));

    _.set(dataG, 'transaction', dataT)
    _.set(dataG, 'installment', dataI)
    result.push(dataG);

    return result;
}

const transactionRecord012 = (model, resumos, parcelas) => {
    let result = [],
        resumo = _.first(resumos),
        tag = _.get(resumo, 'tag', ''),
        totalParcelas = _.get(model, 'nro_parcelas', '01'),
        qtParcelas = _.toInteger(totalParcelas);

    for (let i = 0; i < qtParcelas; i++) {
        let nrParcela = sizedField(i+1, 2),
            installment = `${nrParcela}/${totalParcelas}`,
            filter = { 'nro_parcela': nrParcela },
            found = _.findLast(parcelas, filter),
            dueDate = _.get(found, 'dt_credito', ''),
            vlDesconto = _.get(model, 'vl_desconto', 0),
            vlDividido = _.round(vlDesconto / qtParcelas, 2),
            diference = (vlDesconto - (vlDividido * qtParcelas)),
            firstAmount = _.get(model, 'vl_primeira_parcela', 0),
            nextAmount = _.get(model, 'vl_demais_parcelas', 0),
            netAmount = 0, grossAmount = 0, commission = 0,
            dataT = baseRecord(model, tag),
            dataI = {}, dataG = {},
            idI = md5(`${dataT.id}-${installment}`);

        if (nrParcela === '01') {
            netAmount = firstAmount;
            commission = _.round(vlDividido + diference, 2);
        } else {
            netAmount = nextAmount;
            commission = vlDividido;
        }
        grossAmount = _.round(netAmount + commission, 2);
        _.set(dataI, 'id', idI);
        _.set(dataI, 'transactionId', _.get(dataT, 'id', ''));
        _.set(dataI, 'installment', installment);
        _.set(dataI, 'transType', 'venda');
        _.set(dataI, 'dueDate', dueDate);
        _.set(dataI, 'grossAmount', grossAmount);
        _.set(dataI, 'rate', _.get(dataT, 'rate', 0));
        _.set(dataI, 'commission', commission);
        _.set(dataI, 'netAmount', netAmount);

        _.set(dataG, 'transaction', dataT)
        _.set(dataG, 'installment', dataI)
        result.push(dataG);
    }

    return result;
}

const rejectionRecord = (model, resumos) => {
  let resumo = _.first(resumos),
    tag = _.get(resumo, 'tag', ''),
    result = baseRecord(model, tag);

  _.set(result, 'rejectionCode', _.get(model, 'status_cv_nsu.code', ''));
  _.set(result, 'rejectionName', _.get(model, 'status_cv_nsu.name', ''));
  _.set(result, 'saleId', '');

  return result;
}

export const saveTransaction = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            let model = parsed[i], transactions = [],
                idResumo = _.get(model, '_resumo_venda', ''),
                registro = _.get(model, 'registro', ''),
                statusCV = _.get(model, 'status_cv_nsu.code', '');

            model['fileName'] = fileName;
            if (statusCV === ACCEPTED_CV) {
              if (registro == '008') {
                  const filtered = _.filter(parsed, { registro: '006', '_resumo_venda': idResumo });
                  transactions = transactionRecord008(model, filtered);
              } else if (registro == '012') {
                  const filteredResumos = _.filter(parsed, { registro: '010', '_resumo_venda': idResumo }),
                        filteredParcelas = _.filter(parsed, { registro: '014', '_resumo_venda': idResumo });
                  transactions = transactionRecord012(model, filteredResumos, filteredParcelas);
              }
              await parserAccounting(transactions);
              for (var j = 0; j < transactions.length; j++) {
                  let item = transactions[j];
                  await broker.publish('incanto.Skill.AcquirerTransaction.Post', item);
              }
            } else {
              if ((registro == '008') || (registro == '012')) {
                let resumoId = ((registro == '008') ? '006' : '010'),
                  filtered = _.filter(parsed, { registro: resumoId, '_resumo_venda': idResumo }),
                  rejected = await rejectionRecord(model, filtered);
                await broker.publish('incanto.Skill.AcquirerRejection.Post', rejected);
              }
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
