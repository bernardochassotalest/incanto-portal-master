import _ from 'lodash'
import { md5 } from 'app/lib/utils'
import { parserAccounting } from 'app/jobs/skill/finance-files/itau/boleto/accounting'

const transactionParser = (model) => {
    let result = {
            'transaction': {},
            'occurrence': {}
        },
        keyCommon = _.get(model, '_keys.OurNumber', ''),
        cd_ocorrencia = _.get(model, 'ocorrencia.code', ''),
        modelId = _.get(model, '_id', ''),
        transId = md5(keyCommon),
        occurId = md5(`${modelId}-${cd_ocorrencia}`),
        dt_ocorrencia = _.get(model, 'dt_ocorrencia', ''),
        dt_credito = _.get(model, 'dt_credito', ''),
        vl_ocorrencia = _.get(model, 'vl_titulo', 0),
        vl_pago = _.get(model, 'vl_pago', 0),
        balance = 0, factor = 1, type = 'none';

    if (_.isEmpty(dt_credito) == false) {
        dt_ocorrencia = dt_credito;
        vl_ocorrencia = vl_pago;
    }
    if (_.includes(['02', '06', '09'], cd_ocorrencia) == true) {
        if (cd_ocorrencia != '02') { factor = -1; }
        balance = (factor * vl_ocorrencia);
    }

    if (cd_ocorrencia === '02') {
      type = 'capture';
    } else if (cd_ocorrencia === '06') {
      type = 'settlement'
    } else if (cd_ocorrencia === '09') {
      type = 'cancellation'
    }

    _.set(result, 'transaction.id', transId);
    _.set(result, 'transaction.bank', '341');
    _.set(result, 'transaction.keyCommon', keyCommon);
    _.set(result, 'transaction.branch', _.get(model, 'agencia', ''));
    _.set(result, 'transaction.account', _.get(model, 'conta_corrente', ''));
    _.set(result, 'transaction.digitAccount', _.get(model, 'dig_conta_corrente', ''));
    _.set(result, 'transaction.tag', _.get(model, 'tag', ''));
    _.set(result, 'transaction.slipNumber', _.get(model, 'nro_titulo', ''));
    _.set(result, 'transaction.ourNumber', _.get(model, 'nosso_numero', ''));
    _.set(result, 'transaction.digitOurNumber', _.get(model, 'dig_nosso_numero', ''));
    _.set(result, 'transaction.reference', _.get(model, 'nro_tit_banco', ''));
    _.set(result, 'transaction.wallet', _.get(model, 'nro_carteira', ''));
    _.set(result, 'transaction.kind', _.get(model, 'especie_titulo.name', ''));
    _.set(result, 'transaction.refDate', _.get(model, 'dt_ocorrencia', ''));
    _.set(result, 'transaction.dueDate', _.get(model, 'dt_vencimento', ''));
    _.set(result, 'transaction.amount', _.get(model, 'vl_titulo', 0));
    _.set(result, 'transaction.holderName', _.get(model, 'nome_pagador', ''));

    _.set(result, 'occurrence.id', occurId);
    _.set(result, 'occurrence.transactionId', transId);
    _.set(result, 'occurrence.type', type);
    _.set(result, 'occurrence.occurId', _.get(model, 'ocorrencia.code', ''));
    _.set(result, 'occurrence.occurName', _.get(model, 'ocorrencia.name', ''));
    _.set(result, 'occurrence.paidPlace', _.get(model, 'tipo_liquidacao.name', ''));
    _.set(result, 'occurrence.date', dt_ocorrencia);
    _.set(result, 'occurrence.amount', vl_ocorrencia);
    _.set(result, 'occurrence.discount', _.get(model, 'vl_desconto', 0));
    _.set(result, 'occurrence.interest', _.get(model, 'vl_juros', 0));
    _.set(result, 'occurrence.balance', balance);
    _.set(result, 'occurrence.sourceDb', 'cldr_itau_boleto');
    _.set(result, 'occurrence.sourceId', modelId);
    _.set(result, 'occurrence.fileName', _.get(model, 'fileName', ''));
    _.set(result, 'occurrence.fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

const feeParser = (model) => {
    let result = {}, bank = '341',
        modelId = _.get(model, '_id', ''),
        id = md5(`${bank}-${modelId}`),
        keyCommon = _.get(model, '_keys.OurNumber', '');

    _.set(result, 'id', id);
    _.set(result, '_keys', _.get(model, '_keys', ''));
    _.set(result, 'keyCommon', keyCommon);
    _.set(result, 'bank', bank);
    _.set(result, 'branch', _.get(model, 'agencia', ''));
    _.set(result, 'account', _.get(model, 'conta_corrente', ''));
    _.set(result, 'digitAccount', _.get(model, 'dig_conta_corrente', ''));
    _.set(result, 'tag', _.get(model, 'tag', ''));
    _.set(result, 'date', _.get(model, 'dt_ocorrencia', ''));
    _.set(result, 'feeNumber', _.get(model, 'nro_documento', ''));
    _.set(result, 'amount', _.get(model, 'vl_tarifa', 0));
    _.set(result, 'wallet', _.get(model, 'nro_carteira', ''));
    _.set(result, 'occurId', _.get(model, 'ocorrencia.code', ''));
    _.set(result, 'occurName', _.get(model, 'ocorrencia.name', ''));
    _.set(result, 'sourceDb', 'cldr_itau_boleto');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveTransaction = async (params) => {
    try {
        const { parsed, fileName, broker } = params;
        let settlement = [], fees = [];

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', ''),
                  occurId = _.get(model, 'ocorrencia.code', '');

            model['fileName'] = fileName;
            if (registro == '1') {
                if (_.includes(['51','52','53','54','55'], occurId) == true) { // TARIFAS
                  let fee = feeParser(model);
                  fees.push(fee);
                  await broker.publish('incanto.Skill.SlipFee.Post', fee);
                } else {
                  let slip = transactionParser(model);
                  await parserAccounting(slip);
                  await broker.publish('incanto.Skill.SlipTransaction.Post', slip);
                  if (occurId === '06') { // LIQUIDAÇÃO
                      let concSettlement = JSON.parse(JSON.stringify(slip.occurrence));
                      concSettlement['_keys'] = _.get(model, '_keys', '');
                      settlement.push(concSettlement);
                  }
                }
            }
        }
        params['fees'] = fees;
        params['settlement'] = settlement;
    } catch (error) {
        throw error;
    }

    return params;
}
