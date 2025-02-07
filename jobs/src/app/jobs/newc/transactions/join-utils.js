import _ from 'lodash'
import moment from 'moment'
import creditCardType from 'credit-card-type'
import { mongodb } from 'app/models'
import { stringDate, sizedField, md5 } from 'app/lib/utils'
import { getTag, getPos } from 'app/jobs/skill/commons/utils'
import { getTableByCode } from 'app/jobs/newc/commons/tables'

export const GetPaymentGroup = (method) => {
    let result = 'indefinido',
        contents = _.deburr(_.toLower(method)),
        expression = new RegExp(/(dinheiro|cash|cartao|card|credit_card|fatura|invoice|carga|skytef|visa\/credit|visa\/debit|mastercard\/credit|mastercard\/debit|rede\/|vindi_paytype_credit_card|vindi_paytype_online_bank_slip|vindi_paytype_online_bank_slip_|vind_paytype_bank_debit|online_bank_slip|online_bank_slip_|bank_debit)/ig),
        match = _.uniq(contents.match(expression)),
        table = {
            'dinheiro': 'dinheiro',
            'cash': 'dinheiro',
            'cartao': 'cartao',
            'card': 'cartao',
            'credit_card': 'cartao',
            'fatura': 'invoice',
            'invoice': 'invoice',
            'carga': 'carga',
            'skytef': 'cartao',
            'rede': 'cartao',
            'visa': 'cartao',
            'visadebit': 'cartao',
            'visacredit': 'cartao',
            'mastercard': 'cartao',
            'mastercarddebit': 'cartao',
            'mastercardcredit': 'cartao',
            'vindi_paytype_credit_card': 'cartao',
            'vindi_paytype_online_bank_slip': 'boleto',
            'vindi_paytype_online_bank_slip_': 'boleto',
            'vindi_paytype_bank_debit': 'debito_automatico',
            'online_bank_slip': 'boleto',
            'online_bank_slip_': 'boleto',
            'bank_debit': 'debito_automatico'
        };

    if (match) {
        if (match.length > 0) {
            var found = _.replace(match[0], '/', '');
            result = table[found];
        }
    }

    return result;
}


const GetTransactionHour = (info) => {
    let result = '',
        data = info || '';

    if (_.isEmpty(data) == false) {
        data =  _.split(data, 'T');
        if (_.size(data) > 1) {
            result = data[1].substr(0, 8);
        }
    }
    return result;
};

export const GetConciliationData = (paymentGate, details, posConfig) => {
    let result = {};

    if (paymentGate == '12') {
        let status = _.get(details, 'ReturnCode', '');
        if (status == '00') {
            let cardNumber = '', cardBrand = '';
            const payDate = _.get(details, 'DateTime', ''),
                  cardBin = _.get(details, 'CardBin', ''),
                  lastFour = _.get(details, 'Last4', ''),
                  cardType = creditCardType(cardBin);
            if ((_.isEmpty(cardBin) == false) && (_.isEmpty(lastFour) == false)) {
                cardNumber = cardBin + '******' + lastFour;
            }
            if (_.isEmpty(cardType) == false) {
                cardBrand = cardType[0].niceType;
            }
            _.set(result, 'Acquirer', { 'Code': 'rede', 'Name': 'Rede' });
            _.set(result, 'Date', stringDate(payDate));
            _.set(result, 'Time', GetTransactionHour(payDate));
            _.set(result, 'Amount', _.round(_.get(details, 'Amount', 0))/100, 2);
            _.set(result, 'PointOfSale', _.get(details, 'Affiliation', ''));
            _.set(result, 'Reference', _.get(details, 'Reference', ''));
            _.set(result, 'Tid', _.get(details, 'TransactionId', ''));
            _.set(result, 'Nsu', _.get(details, 'Nsu', ''));
            _.set(result, 'Authorization', _.get(details, 'AuthorizationCode', ''));
            _.set(result, 'CardNumber', cardNumber);
            _.set(result, 'CardBrand', _.toUpper(cardBrand));
        }
    }
    if ((paymentGate == '11') || (paymentGate == '13')) {
        let status = _.get(details, 'ReturnCode', '');
        if (status == '00') {
            let payDate = '', payTime = '';
            let cardBrand = _.get(details, 'CardBrand', '');
            let fiscalReturn = _.split(_.get(details, 'FiscalReturn', ''), '-');
            if (_.size(fiscalReturn) > 2) {
                payDate = fiscalReturn[1];
                payTime = fiscalReturn[2];
                if (_.isEmpty(payDate) == false) {
                    payDate = payDate.substr(0, 4) + '-' + payDate.substr(4, 2) + '-' + payDate.substr(6, 2)
                }
                if (_.isEmpty(payTime) == false) {
                    payTime = payTime.substr(0, 2) + ':' + payTime.substr(2, 2) + ':' + payTime.substr(4, 2)
                }
            }
            let operatorCode = _.get(details, 'OperatorCode', ''),
                pos = getPos(posConfig, 'skytef', operatorCode);
            _.set(result, 'Acquirer', _.get(pos, 'Acquirer', ''));
            _.set(result, 'Date', payDate);
            _.set(result, 'Time', payTime);
            _.set(result, 'Amount', _.round(_.get(details, 'TransactionAmount', 0))/100, 2);
            _.set(result, 'PointOfSale', _.get(pos, 'PointOfSale', ''));
            _.set(result, 'Reference', _.get(details, 'TransactionId', ''));
            _.set(result, 'Tid', '');
            _.set(result, 'Nsu', _.get(details, 'Nsu', ''));
            _.set(result, 'Authorization', _.get(details, 'AuthorizationCode', ''));
            _.set(result, 'CardNumber', _.get(details, 'CardNumber', ''));
            _.set(result, 'CardBrand', _.get(getTableByCode('skytef_cardbrand', cardBrand), 'name', ''));
        }
    }
    if (paymentGate == '15') {
        let status = _.get(details, 'event.data.bill.status', '');
        if (status == 'paid') {
            let charges = _.get(details, 'event.data.bill.charges', []),
                subscription = _.get(details, 'event.data.bill.subscription', {});

            for (var i = 0; i < charges.length; i++) {
                let charge = charges[i],
                    last_transaction = _.get(charge, 'last_transaction', ''),
                    payment_method = _.get(charge, 'payment_method.code', ''),
                    status = _.get(charge, 'status', ''),
                    gatewayId = _.get(last_transaction, 'gateway.id', ''),
                    pos = getPos(posConfig, 'vindi', gatewayId);

                if ((payment_method == 'credit_card') && (status == 'paid')) {
                    let cardNumber = '';
                    const payDate = _.get(charge, 'paid_at', ''),
                          cardBin = _.get(last_transaction, 'payment_profile.card_number_first_six', ''),
                          lastFour = _.get(last_transaction, 'payment_profile.card_number_last_four', '');
                    if ((_.isEmpty(cardBin) == false) && (_.isEmpty(lastFour) == false)) {
                        cardNumber = cardBin + '******' + lastFour;
                    }

                    _.set(result, 'Acquirer', _.get(pos, 'Acquirer', ''));
                    _.set(result, 'Date', stringDate(payDate));
                    _.set(result, 'Time', GetTransactionHour(payDate));
                    _.set(result, 'Amount', Number(_.get(last_transaction, 'amount', 0)));
                    _.set(result, 'PointOfSale', _.get(pos, 'PointOfSale', ''));
                    _.set(result, 'Tid', _.get(last_transaction, 'gateway_response_fields.tid', ''));
                    _.set(result, 'Nsu', _.get(last_transaction, 'gateway_response_fields.proof_of_sale', ''));
                    _.set(result, 'Authorization', _.get(last_transaction, 'gateway_response_fields.authorization_code', ''));
                    _.set(result, 'CardNumber', cardNumber);
                    _.set(result, 'CardBrand', _.toUpper(_.get(last_transaction, 'payment_profile.payment_company.name', '')));
                }
            }
        }
    }

    return result;
}



