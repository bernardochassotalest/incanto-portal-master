import _ from 'lodash'
import moment from 'moment'
import { stringDate, sizedField, md5 } from 'app/lib/utils'
import { mongodb, postgres } from 'app/models'
import { loadPontoVenda, loadPosConfig } from 'app/jobs/skill/commons/utils'
import { getTableByName, getDescriptionByCode } from 'app/jobs/newc/commons/tables'
import { GetPaymentGroup, ParserCardTransaction, GetConciliationData, LoadAcctConfig } from './join-utils'
import libAsync from 'async';


const GetClientsProductsIds = async (params) => {
    let idsOwner01 = _.map(_.get(params, 'BulkTransactions', []), 'OwnerUserId'),
        idsOwner02 = _.map(_.get(params, 'BulkTransactions', []), 'CoownerUserId'),
        idsOwner03 = _.map(_.get(params, 'BulkBoughtProducts', []), 'OwnerUserId'),
        idsProduct01 = _.map(_.get(params, 'BulkBoughtProducts', []), 'ProductId'),
        idsProduct02 = _.map(_.get(params, 'BulkBoughtProducts', []), 'ProductID'),
        idsClients = _.uniq(_.concat(idsOwner01, idsOwner02, idsOwner03)),
        idsProducts = _.uniq(_.concat(idsProduct01, idsProduct02)),
        idsMatch = _.map(idsProducts, function(item) { return 'NEWC-' + sizedField(item, 7) });

    params['Clients'] = await mongodb.sales_newc_clients.listForLink(idsClients)
    params['Products'] = await mongodb.sales_newc_products.listForLink(idsProducts)
    params['Matches'] = await postgres.Matches.listForLink(idsMatch)

    return params;
}

const ReviewBulkTransactions = async (params) => {
    const BulkTransactions = params.BulkTransactions;

    params['NewcTransactions'] = [];

    try {
        for (var i = 0; i < BulkTransactions.length; i++) {
            let item = BulkTransactions[i],
                id = String(_.get(item, 'Id', '')),
                filterOwner = { 'UserId': _.get(item, 'OwnerUserId', 0) },
                filterCoowner = { 'UserId': _.get(item, 'CoownerUserId', 0) },
                status = _.get(item, 'Status', ''),
                paymentType = _.get(item, 'PaymentType', ''),
                paymentGate = _.get(item, 'PaymentGate', ''),
                transactionDate = _.get(item, 'CreatedOn', ''),
                model = {
                    '_id': id,
                    'TransactionDate': stringDate(transactionDate),
                    'BulkTransactions' : item
                };

            item['Status'] = {'Code': status, 'Name': getDescriptionByCode('transaction_status', status)};
            item['PaymentType'] = {'Code': paymentType, 'Name': getDescriptionByCode('payment_type', paymentType)};
            item['PaymentGate'] = {'Code': paymentGate, 'Name': getDescriptionByCode('payment_gate', paymentGate)};
            item['PaymentGroup'] = GetPaymentGroup(_.get(item, 'PaymentMethod', ''));

            let owner = _.findLast(params.Clients, filterOwner);
            if (owner) {
                item['Owner'] = owner;
            }

            let coowner = _.findLast(params.Clients, filterCoowner);
            if (coowner) {
                item['Coowner'] = coowner;
            }
            params.NewcTransactions.push(model);
        }

    } catch (error) {
        throw error;
    }
    return params;
}

const ReviewBulkBoughtProductsPriceComponets = async (params) => {
    const BulkBoughtProductsPriceComponets = params.BulkBoughtProductsPriceComponets,
          BulkBoughtProducts = params.BulkBoughtProducts;

    try {
        for (var i = 0; i < BulkBoughtProductsPriceComponets.length; i++) {
            let item = BulkBoughtProductsPriceComponets[i],
                filter = { 'Id': _.get(item, 'Id', '') },
                found = _.findLast(BulkBoughtProducts, filter);
            if (found) {
                if (_.isEmpty(found.PriceComponents) == true) {
                    found.PriceComponents = [];
                }
                found.PriceComponents.push(item);
            }
        }
    } catch (error) {
        throw error;
    }

    return params;
}

const ReviewBulkBoughtProducts = async (params) => {
    const BulkBoughtProducts = params.BulkBoughtProducts;
    for (var i = 0; i < BulkBoughtProducts.length; i++) {
        let item = BulkBoughtProducts[i],
            operation = _.get(item, 'Operation', ''),
            returnType = _.get(item, 'ReturnType', ''),
            status = _.get(item, 'Status', ''),
            product_type = _.get(item, 'ProductType', ''),
            priceComponents = _.get(item, 'PriceComponents', []),
            filterOwner = { 'UserId': _.get(item, 'OwnerUserId', 0) },
            filterProduct = { 'ProductId': _.get(item, 'ProductId', 0) },
            filterTransaction = { '_id': String(_.get(item, 'TransationId', '')) },
            discount = 0, fee = 0, treshold = 0;

        item['Operation'] = {'Code': operation, 'Name': getDescriptionByCode('bought_product_operation', operation)};
        item['ReturnType'] = {'Code': returnType, 'Name': getDescriptionByCode('bought_product_return_type', returnType)};
        item['Status'] = {'Code': status, 'Name': getDescriptionByCode('bought_product_status', status)};
        item['ProductGroup'] = _.get(getTableByName('product_type', product_type), 'group', 'not-found');

        let owner = _.findLast(params.Clients, filterOwner);
        if (owner) {
            item['Owner'] = owner;
        }

        let product = _.findLast(params.Products, filterProduct);
        if (product) {
            item['Product'] = product;
            treshold = _.toNumber(_.get(product, 'FederationReportPriceTreshold', 0));
            if (_.isNaN(treshold) == true) {
                treshold = 0;
            }
        }

        for (var j = 0; j < priceComponents.length; j++) {
            let prices = priceComponents[j],
                total = _.get(prices, 'Total', 0);
            if (total > 0) {
                fee += total;
            } else {
                discount += total;
            }
        }
        item['PriceTreshold'] = treshold;
        item['Discount'] = discount;
        item['Fee'] = fee;

        let transaction = _.findLast(params.NewcTransactions, filterTransaction);
        if (transaction) {
            let productId = 'NEWC-' + sizedField(_.get(item, 'ProductId', ''), 7),
                filterMatch = { 'Code': productId },
                tag = 'avanti';
            let match = _.findLast(params.Matches, filterMatch);
            if (match) {
                _.set(transaction, 'BulkTransactions.Match', match);
                _.set(transaction, 'BulkTransactions.Championship', _.get(match, 'Championship', ''));
            }
            if (_.isEmpty(transaction.BulkBoughtProducts) == true) {
                transaction.BulkBoughtProducts = [];
            }
            if (_.toLower(item.ProductGroup) == 'tickets') {
                tag = 'bilheteria';
            }
            _.set(transaction, 'BulkTransactions.Tag', tag);
            transaction.BulkBoughtProducts.push(item);
        }
    }

    return params;
}

const ReviewBulkTransactionsPayments = async (params) => {
    const BulkTransactionsPayments = params.BulkTransactionsPayments,
          tags = _.get(params, 'tags', []),
          posConfig = _.get(params, 'posConfig', []);

    for (var i = 0; i < BulkTransactionsPayments.length; i++) {
        let item = BulkTransactionsPayments[i],
            id = String(_.get(item, 'TransactionId', '')),
            filter = { '_id': id };

        let transaction = _.findLast(params.NewcTransactions, filter);
        if (transaction) {
            let paymentGate = _.get(transaction, 'BulkTransactions.PaymentGate.Code', ''),
                conciliation = GetConciliationData(paymentGate, _.get(item, 'Details', {}), posConfig),
                concDate = _.get(conciliation, 'Date', ''),
                concAmount = _.get(conciliation, 'Amount', 0),
                conciliated = (_.isEmpty(concDate) == false && concAmount > 0 ? true : false);
            if (conciliated == true) {
                item['Conciliation'] = conciliation;
            }
            if (_.isEmpty(transaction.TransactionsPayments) == true) {
                transaction.TransactionsPayments = [];
            }
            transaction.TransactionsPayments.push(item);
        }
    }

    return params;
}


export const JoinBulkData = async (params, callback) => {
  try {
    await GetClientsProductsIds(params);
    await ReviewBulkTransactions(params);
    await ReviewBulkBoughtProductsPriceComponets(params);
    await ReviewBulkBoughtProducts(params);
    await loadPontoVenda(params);
    await loadPosConfig(params);
    await ReviewBulkTransactionsPayments(params);

  } catch (error) {
    throw error;
  }

  return params;
}
