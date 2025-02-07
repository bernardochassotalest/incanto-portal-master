import _ from 'lodash'
import { md5 } from 'app/lib/utils'
import { parserAccounting } from 'app/jobs/skill/finance-files/itau/debito-240/accounting'

const transactionParser = (model) => {
    let result = {
            'transaction': {},
            'occurrence': {}
        },
        keyCommon = _.get(model, '_keys.DebitNumber', ''),
        cd_ocorrencia = _.get(model, 'ocorrencia1.code', ''),
        modelId = _.get(model, '_id', ''),
        transId = md5(keyCommon),
        occurId = md5(`${modelId}-${cd_ocorrencia}`),
        dt_ocorrencia = _.get(model, 'data_arquivo', ''),
        dt_credito = _.get(model, 'data_cobrada', ''),
        cleanData = _.replace(dt_credito, /\-/ig, ''),
        vl_ocorrencia = _.get(model, 'valor_agendado', 0),
        vl_pago = _.get(model, 'valor_cobrado', 0),
        balance = 0, type = 'none';

    if (_.toNumber(cleanData) > 0) {
        dt_ocorrencia = dt_credito;
        vl_ocorrencia = vl_pago;
    }

    if (cd_ocorrencia === 'BD') {
      type = 'capture';
      balance = vl_ocorrencia;
    } else if (cd_ocorrencia === '00') {
      type = 'settlement'
      balance = (-1 * vl_ocorrencia);
    }

    _.set(result, 'transaction.id', transId);
    _.set(result, 'transaction.keyCommon', keyCommon);
    _.set(result, 'transaction.crdBank', _.get(model, '_keys.Bank', ''));
    _.set(result, 'transaction.crdBranch', _.get(model, '_keys.Branch', ''));
    _.set(result, 'transaction.crdAccount', _.get(model, '_keys.Account', ''));
    _.set(result, 'transaction.crdAcctDigit', _.get(model, '_keys.DigitAcct', ''));
    _.set(result, 'transaction.debBank', _.get(model, 'banco_debitado', ''));
    _.set(result, 'transaction.debBranch', _.get(model, 'agencia_debitada', ''));
    _.set(result, 'transaction.debAccount', _.get(model, 'conta_debitada', ''));
    _.set(result, 'transaction.debAcctDigit', _.get(model, 'dig_conta_debitada', ''));
    _.set(result, 'transaction.tag', _.get(model, 'tag', ''));
    _.set(result, 'transaction.debitNumber', _.get(model, 'nro_documento', ''));
    _.set(result, 'transaction.ourNumber', _.get(model, 'nosso_numero', ''));
    _.set(result, 'transaction.refDate', _.get(model, 'data_arquivo', ''));
    _.set(result, 'transaction.dueDate', _.get(model, 'data_agendada', ''));
    _.set(result, 'transaction.amount', _.get(model, 'valor_agendado', 0));
    _.set(result, 'transaction.vatNumber', _.get(model, 'nro_inscricao', ''));
    _.set(result, 'transaction.holderName', _.get(model, 'nome_debitado', ''));

    _.set(result, 'occurrence.id', occurId);
    _.set(result, 'occurrence.transactionId', transId);
    _.set(result, 'occurrence.type', type);
    _.set(result, 'occurrence.occurId', _.get(model, 'ocorrencia1.code', ''));
    _.set(result, 'occurrence.occurName', _.get(model, 'ocorrencia1.name', ''));
    _.set(result, 'occurrence.date', dt_ocorrencia);
    _.set(result, 'occurrence.amount', vl_ocorrencia);
    _.set(result, 'occurrence.interest', _.get(model, 'valor_mora', 0));
    _.set(result, 'occurrence.balance', balance);
    _.set(result, 'occurrence.sourceDb', 'c_cldr_itau_debito');
    _.set(result, 'occurrence.sourceId', modelId);
    _.set(result, 'occurrence.fileName', _.get(model, 'fileName', ''));
    _.set(result, 'occurrence.fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveTransaction = async (params) => {
    try {
        const { parsed, fileName, broker } = params;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', '');

            model['fileName'] = fileName;
            if (registro == '3') {
                let directDebit = transactionParser(model)
                await parserAccounting(directDebit);
                await broker.publish('incanto.Skill.DirectDebitTransaction.Post', directDebit);
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}
