import _ from 'lodash'
import debug from 'debug';
import libAsync from 'async';
import { md5, getTimeLog, sizedField } from 'app/lib/utils'
import { onlyNumbers } from 'app/lib/helper';
import { mongodb, postgres } from 'app/models';
import { getPeriods } from 'app/jobs/newc/commons/utils'
import { getCustomerId, getTransactionKeys } from 'app/jobs/skill/commons/utils'
import { BulkTransactions, BulkBoughtProducts, BulkBoughtProductsPriceComponents,
         BulkTransactionsPayments } from 'app/jobs/newc/commons/bulk'
import { JoinBulkData } from './join-data'

const log = debug('incanto:newc:transactions');

const workerQueue = libAsync.queue(({ data, broker }, done) => {
  log(`NewC - Transactions - processing init`);

  handleApi(data, broker)
    .then((result) => {
      log(`NewC - Transactions - processing done - result: ${result}`);
      done();
    })
}, 1);

const SavePostgresAvanti = async (data) => {
  const transaction = await postgres.SaleItems.sequelize.transaction(),
    ITEM_MAPPING = {
      '1': 'CARTÃO VIRTUAL',
      '2': 'CARTÃO FÍSICO'
    };

  try {
    const BulkBoughtProducts = _.get(data, 'BulkBoughtProducts', []),
      TransactionsPayments = _.get(data, 'TransactionsPayments', []);

    for (let j = 0; j < TransactionsPayments.length; j++) {
      const transPayment = TransactionsPayments[j],
        VindiBill = _.toString(_.get(transPayment, 'Details.event.data.bill.id', '')),
        VindiItems = _.get(transPayment, 'Details.event.data.bill.bill_items', []);

      for (let i = 0; i < VindiItems.length; i++) {
        let vindiItem = VindiItems[i],
          newcItem = BulkBoughtProducts[i];

        if ((_.isEmpty(vindiItem) == false) && (_.isEmpty(newcItem) == false)) {
          let itemId = _.toString(_.get(vindiItem, 'id', '')),
            lineId = md5(`vindi-${VindiBill}-${itemId}`),
            owner = _.get(newcItem, 'Owner', ''),
            firstName = _.get(owner, 'FirstName') || '',
            lastName = _.get(owner, 'LastName') || '',
            lineModel = {
              ownerId: _.toString(_.get(owner, 'UserId', '')),
              ownerVatNo: _.get(owner, 'Identifier', ''),
              ownerName: _.trim(`${firstName} ${lastName}`),
            };
          await postgres.SaleItems.update(lineModel, { where: { id: lineId }}, { transaction });

          let transactionId = _.toString(_.get(newcItem, 'TransationId', '')),
            boughtId = _.toString(_.get(newcItem, 'Id', '')),
            memberId = md5(`newc-${transactionId}-${boughtId}`),
            membershipModel = {
              id: memberId,
              saleItemId: lineId,
              sourceName: 'newc',
              sourceDb: 'sales_newc_transactions',
              sourceId: transactionId,
              itemId: boughtId,
              itemCode: _.get(newcItem, 'ProductId', ''),
              itemName: _.get(newcItem, 'Product.Name', ''),
              itemType: _.get(newcItem, 'ProductType', ''),
              itemGroup: _.get(newcItem, 'ProductGroup', ''),
              operation: _.get(newcItem, 'Operation.Name', ''),
            };
          if (_.isEmpty(membershipModel.itemName) == true) {
            membershipModel['itemName'] = ITEM_MAPPING[membershipModel.itemCode];
          }
          await postgres.Memberships.upsert(membershipModel, { transaction });
        }
      }
    }

    await transaction.commit();
  } catch(err) {
    await transaction.rollback();
    log(`Error: ${err}`);
  }
}

const getOwner = (data) => {
  let firstName = _.get(data, 'FirstName') || '',
    lastName = _.get(data, 'LastName') || '',
    businessAccount = _.get(data, 'BusinessAccount') || false,
    result = {
      ownerId: _.toString(_.get(data, 'UserId')) || '',
      ownerVatNo: _.toString(onlyNumbers(_.get(data, 'Identifier'))) || '',
      ownerName: _.trim(`${firstName} ${lastName}`)
    };

  if (businessAccount == true) {
    result['ownerVatNo'] = onlyNumbers(_.get(data, 'VatNumber', ''));
    result['ownerName'] = _.get(data, 'Identifier', '');
  }
  return result;
}

const savePostgresItems = async (lines,  source, transaction) => {
    let id = source.sourceId;
    for (let i = 0; i < lines.length; i++) {
        let billItem = lines[i],
            itemId = _.toString(_.get(billItem, 'Id', '')),
            owner = getOwner(_.get(billItem, 'Owner', '')),
            baseMatch = _.padStart(_.trim(_.get(billItem, 'ProductId', '')), 7, '0'),
            saleItem = {
                id: md5(`newc-${id}-${itemId}`),
                itemCode: _.toString(_.get(billItem, 'ProductId', '')),
                itemName: _.get(billItem, 'Product.Name', ''),
                quantity: 1,
                unitPrice: _.get(billItem, 'BasePrice', 0),
                discAmount: _.get(billItem, 'Discount', 0),
                totalAmount: _.get(billItem, 'Price', 0),
                ...owner,
                ...source
            },
            ticket = {
              id: md5(`newc-${id}-${itemId}-${baseMatch}`),
              saleItemId: saleItem.id,
              matchId: `NEWC-${baseMatch}`,
              priceName: _.get(billItem, 'PriceName', ''),
              priceGroupName: _.get(billItem, 'PriceGroupName', ''),
              priceAreaName: _.get(billItem, 'PriceAreaName', ''),
              priceTreshold: _.get(billItem, 'PriceTreshold', 0),
              fee: _.get(billItem, 'Fee', 0),
              attendenceDate: _.get(billItem, 'AttendenceDate', ''),
              gate: _.get(billItem, 'AttendenceGate', ''),
              area: _.get(billItem, 'Platform', ''),
              sector: _.get(billItem, 'Sector', ''),
              row: _.get(billItem, 'Row', ''),
              seat: _.get(billItem, 'Number', ''),
            };
        saleItem['sourceId'] = itemId;
        await postgres.SaleItems.upsert(saleItem, { transaction });
        await postgres.Tickets.upsert(ticket, { transaction });
    }
}

const getCreditcardKeys = (data) => {
    let baseKeys = {
        'PointOfSale': _.get(data, 'PointOfSale', ''),
        'Date': _.get(data, 'Date', ''),
        'Nsu': _.get(data, 'Nsu', ''),
        'Tid': _.get(data, 'Tid', ''),
        'Authorization': _.get(data, 'Authorization', ''),
        'Reference': _.get(data, 'Reference', '')
      },
      keys = getTransactionKeys(baseKeys),
      result = { PointOfSale: baseKeys.PointOfSale, ...keys };

    return result;
}

const savePostgresPayments = async (data, sale, transaction, broker) => {
  let group = _.get(data, 'BulkTransactions.PaymentGroup', ''),
    mapping = {
      'dinheiro': 'money',
      'cartao': 'creditcard',
      'carga': 'cost',
      'invoice': 'invoice'
    };

  if (_.includes(_.keys(mapping), group) == true) {
    let type = mapping[group],
      payment = {
        id: md5(`${sale.sourceId}-${sale.refDate}`),
        sourceName: 'newc',
        sourceDb: 'sales',
        sourceId: sale.sourceId,
        saleId: sale.id,
        tag: 'bilheteria',
        refDate: sale.refDate,
        taxDate: sale.taxDate,
        dueDate: sale.dueDate,
        amount: sale.amount,
        status: 'pending',
        type: type,
        isConcilied: false,
        timeLog: getTimeLog()
      };
    await postgres.SalePayments.upsert(payment, { transaction });

    if (group == 'cartao') {
      const transactionsPayments = _.get(data, 'TransactionsPayments', []);
      for (let i = 0; i < transactionsPayments.length; i++) {
        let itemPayment = transactionsPayments[i],
          conciliation = _.get(itemPayment, 'Conciliation', ''),
          keys = getCreditcardKeys(conciliation),
          amount = _.get(conciliation, 'Amount', 0),
          creditcard = {
            paymentId: payment.id,
            acquirer: _.get(conciliation, 'Acquirer.Code', ''),
            pointOfSale: _.get(conciliation, 'PointOfSale', ''),
            keyCommon: _.get(keys, 'Authorization', ''),
            keyNsu: _.get(keys, 'Nsu', ''),
            keyTid: _.get(keys, 'Tid', ''),
            time: _.get(conciliation, 'Time',''),
            tid: _.get(conciliation, 'Tid', ''),
            nsu: _.get(conciliation, 'Nsu', ''),
            authorization: _.get(conciliation, 'Authorization', ''),
            cardNumber: _.get(conciliation, 'CardNumber', ''),
            cardBrand: _.get(conciliation, 'CardBrand', ''),
            holderName: ''
          },
          concItem = {
            id: md5(`creditcard_capture-newc-${payment.id}`),
            date: _.get(conciliation, 'Date', ''),
            rule: 'creditcard_capture',
            sourceName: 'newc',
            sourceDb: 'sales',
            sourceId: sale.sourceId,
            debit: amount,
            balance: (-1 * amount),
            pointOfSale: sizedField(keys.PointOfSale, 12),
            keyCommon: _.get(keys, 'Authorization', ''),
            keyTid: _.get(keys, 'Tid', ''),
            keyNsu: _.get(keys, 'Nsu', ''),
          };
        await postgres.PaymentCreditcards.upsert(creditcard, { transaction });
        await broker.publish('incanto.Skill.ConciliationItems.Post', concItem);
      }
    }
  }
}

const SavePostgresBilheteria = async (data, broker) => {
  const transaction = await postgres.Sales.sequelize.transaction();

  try {
    let bulkTransactionId = _.toString(_.get(data, 'BulkTransactions.Id', '')),
      coownerId = _.toString(_.get(data, 'BulkTransactions.Coowner.UserId', '')),
      ownerId = _.toString(_.get(data, 'BulkTransactions.Owner.UserId', '')),
      billCustId = (_.isEmpty(coownerId) == false ? coownerId : ownerId),
      customerId = await getCustomerId('sales_newc_clients', billCustId, transaction);

    if (_.isEmpty(customerId) == false) {
      let saleId = md5(`newc-${bulkTransactionId}`),
        status = 'pending',
        source = {
            saleId: saleId,
            sourceName: 'newc',
            sourceDb: 'sales_newc_transactions',
            sourceId: bulkTransactionId,
        },
        sale = {
            id: saleId,
            customerId: customerId,
            refDate: _.get(data, 'TransactionDate', ''),
            taxDate: _.get(data, 'TransactionDate', ''),
            dueDate: _.get(data, 'TransactionDate', ''),
            cancelDate: '',
            amount: _.get(data, 'BulkTransactions.Price', 0),
            status: status,
            tag: 'bilheteria',
            startPeriod: '',
            endPeriod: '',
            isCaptured: 'none',
            isPecld: 'none',
            isCredit: 'none',
            ...source
        },
        saleItems = _.get(data, 'BulkBoughtProducts', []),
        where = { id: saleId },
        found = await postgres.Sales.findOne({where, transaction});
      if (found) {
        let updSale = { status: status };
        await postgres.Sales.update(updSale, {where, transaction});
      } else {
        await postgres.Sales.upsert(sale, { transaction });
      }
      await savePostgresItems(saleItems, source, transaction);
      await savePostgresPayments(data, sale, transaction, broker);
    } else {
      let notFound = { id: bulkTransactionId, status: 'noCustomer', ownerId, coownerId };
      await postgres.NewcSales.upsert(notFound, { transaction });
    }

    await transaction.commit();
  } catch(err) {
    await transaction.rollback();
    log(`Error: ${err}`);
  }
}

const SaveBulkTransactions = async (params, broker) => {
  try {
    const NewcTransactions = params.NewcTransactions;
    let lastStage = 0;

    for (let i = 0; i < NewcTransactions.length; i++) {
      let model = NewcTransactions[i],
        tag = _.get(model, 'BulkTransactions.Tag', ''),
        filterTransaction = { '_id': _.get(model, '_id', '') },
        stage = _.round(i / NewcTransactions.length * 100);

      await mongodb.sales_newc_transactions.upsert(filterTransaction, model);
      if (tag == 'avanti') {
        await SavePostgresAvanti(model);
      } else if (tag == 'bilheteria') {
        await SavePostgresBilheteria(model, broker);
      }
      if ((stage % 10 === 0)  && (stage > lastStage)) {
        log(`${getTimeLog()} - Content Processed: ${stage}%  Actual: ${i} Last: ${NewcTransactions.length}`)
        lastStage = stage;
      }
    }
  } catch (error) {
    throw error;
  }

  return params;
}

const processData = async (currentPeriod, broker) => {
  try {
    let params = { currentPeriod };

    await BulkTransactions(params);
    await BulkBoughtProducts(params);
    await BulkBoughtProductsPriceComponents(params);
    await BulkTransactionsPayments(params);
    await JoinBulkData(params);
    await SaveBulkTransactions(params, broker);
  } catch (error) {
    throw error;
  }
}

const handleApi = async (pooling, broker) => {
  try {
    let periods = getPeriods('transactions', pooling);

    for (let i = 0; i < periods.length; i++) {
      await processData(periods[i], broker);
    }

    await postgres.Pooling.saveStart('newc-transactions', 'daily');

    process.running_newc = false;
  } catch(err) {
    log(`Error while process transactions: ${err}`)
    process.running_newc = false;
    return false;
  }
  return true;
};

export default {
  process({ data, broker }) {
    workerQueue.push({ data, broker })
  }
};
