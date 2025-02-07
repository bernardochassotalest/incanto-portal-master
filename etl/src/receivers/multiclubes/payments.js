import _ from 'lodash'
import { onlyNumbers } from '../../lib/helper';
import { getTransactionKeys, getPos, md5, leftString } from '../../lib/utils'

const getKeys = (data, posConfig) => {
    let type = _.get(data, 'Tef.Type.ID', -1),
        pointOfSale = '', tid = '',
        confSource = getPos(posConfig, 'multiclubes', type);

    if ((type === 0) || (type === 2)) {
        pointOfSale = _.get(confSource, 'PointOfSale', '')
    } else if (type === 1) {
        pointOfSale = _.get(confSource, 'PointOfSale', '')
        tid = _.get(data, 'Tef.Tid', '')
    }

    let baseKeys = {
            'PointOfSale': pointOfSale,
            'Date': _.get(data, 'Tef.Date', ''),
            'Nsu': _.get(data, 'Tef.Nsu', ''),
            'Authorization': _.get(data, 'Tef.AuthNumber', ''),
            'Tid': tid,
            'Reference': ''
        },
        keys = getTransactionKeys(baseKeys);

    return { pointOfSale, ...keys };
}

const paymentsCapture = async (options) => {
  const { postgres, mongodb, publish, content } = options,
    payments = _.get(content, 'Items', []),
    parcels = _.get(content, 'Parcels', []),
    posConfig = await mongodb.cldr_pos_config.loadAll();

  for (let i = 0; i < payments.length; i++) {
    let item = payments[i],
        type = _.get(item, 'Type.ID', ''),
        rule = 'creditcard_capture',
        paymentId = _.get(content, 'Payment.ID', ''),
        itemPaymentId = _.get(item, 'ID', ''),
        modelId = md5(`${paymentId}-${itemPaymentId}`),
        id = md5(`${rule}-multiclubes-${modelId}`),
        concModel = {},
        paymentData = {
          id: modelId,
          paymentId: paymentId,
          itemPaymentId: itemPaymentId,
          titleId: _.get(content, 'Title.ID', ''),
          titleNumber: _.get(content, 'Title.Number', ''),
          memberVatNumber: onlyNumbers(_.get(content, 'Member.Document', '')),
          memberName: leftString(_.get(content, 'Member.Name', ''), 200),
          type: leftString(_.get(item, 'Type.Description', ''), 50),
          mode: leftString(_.get(item, 'Mode.Name', ''), 50),
          paidDate: _.get(content, 'Payment.PaidDate', ''),
          paidAmount: _.get(item, 'PaidValue', ''),
          dunInstitution: _.get(item, 'Dun.Institution.Code', ''),
          dunBranch: _.get(item, 'Dun.Agency', ''),
          dunAccount: _.get(item, 'Dun.Account', ''),
          dunDueDate: _.get(item, 'Dun.DueDate', ''),
          dunOurNumber: _.get(item, 'Dun.OwnerNumber', ''),
          dunReturnFile: leftString(_.get(content, 'Payment.ReturnFileName', ''), 100),
          tefInstitution: _.get(item, 'Tef.Institution', ''),
          tefCardType: _.get(item, 'Tef.CardType', ''),
          tefDate: _.get(item, 'Tef.Date', ''),
          tefTime: _.get(item, 'Tef.Time', ''),
          tefNsu: _.get(item, 'Tef.Nsu', ''),
          tefAuthNumber: _.get(item, 'Tef.AuthNumber', ''),
          tefTid: _.get(item, 'Tef.Tid', ''),
          tefCardNumber: _.get(item, 'Tef.CardNumber', ''),
          tefParcelType: leftString(_.get(item, 'Tef.ParcelType', ''), 50),
          tefParcelQty: _.get(item, 'Tef.ParcelQty', ''),
          tefHolderName: leftString(_.get(item, 'Tef.HolderName', ''), 200),
          checkInstitution: _.get(item, 'Check.Institution.Code', ''),
          checkDueDate: _.get(item, 'Check.DueDate', ''),
          checkNumber: _.get(item, 'Check.Number', ''),
          checkOwner: leftString(_.get(item, 'Check.Owner', ''), 200),
        };

    await postgres.MulticlubesPayments.upsert(paymentData);

    if (type === 4) {  //Cartão
        let keys = getKeys(item, posConfig);
        _.set(concModel, 'id', id);
        _.set(concModel, 'date', _.get(item, 'Tef.Date', ''));
        _.set(concModel, 'rule', rule);
        _.set(concModel, 'sourceName', 'multiclubes');
        _.set(concModel, 'sourceDb', 'multiclubesPayments');
        _.set(concModel, 'sourceId', modelId);
        _.set(concModel, 'debit', _.get(item, 'Tef.Value', 0));
        _.set(concModel, 'balance', (-1 * _.get(item, 'Tef.Value', 0)));
        _.set(concModel, 'pointOfSale', _.get(keys, 'pointOfSale', ''));
        _.set(concModel, 'keyCommon', _.get(keys, 'Authorization', ''));
        _.set(concModel, 'keyTid', _.get(keys, 'Tid', ''));
        _.set(concModel, 'keyNsu', _.get(keys, 'Nsu', ''));
        publish('incanto.Skill.ConciliationItems.Post', concModel);
    }
  }

  for (let i = 0; i < parcels.length; i++) {
    let item = parcels[i],
      paymentId = _.get(content, 'Payment.ID', ''),
      parcelId = _.get(item, 'Parcel.ID', ''),
      prdType = _.get(item, 'SaleItems.Product.Type.Description', ''),
      prdName = _.get(item, 'SaleItems.Product.Description', ''),
      parcelData = {
        id: md5(`${paymentId}-${parcelId}`),
        saleId: _.get(item, 'Sale.ID', ''),
        saleDate: _.get(item, 'Sale.Date', ''),
        paymentId: paymentId,
        productId: _.get(item, 'SaleItems.Product.ID', ''),
        productName: leftString(`${prdType} - ${prdName}`, 200),
        productGroup: leftString(_.get(item, 'SaleItems.ProductGroup.ID', ''), 10),
        accountingGroup: leftString(_.get(item, 'SaleItems.AccountingGroup.ID', ''), 20),
        dependentName: leftString(_.get(item, 'Dependent.Name', ''), 200),
        dependentParentage: leftString(_.get(item, 'Dependent.Parentage.Description', ''), 50),
        parcelId: parcelId,
        dueDate: _.get(item, 'Parcel.DueDate', ''),
        parcelAmount: _.get(item, 'Parcel.Value', ''),
        interestAmount: _.get(item, 'Parcel.InterestValue', ''),
        arrearsAmount: _.get(item, 'Parcel.ArrearsValue', ''),
        discountAmount: _.get(item, 'Parcel.DiscountValue', ''),
        downPayment: _.get(item, 'Parcel.DownPaymentAdjust', ''),
        amountDue: _.get(item, 'Parcel.AmountDue', ''),
        paidAmount: _.get(item, 'Parcel.PaidValue', ''),
      };

    await postgres.MulticlubesParcels.upsert(parcelData);
  }
}

const saveData = async({logger, publish, done, models: {postgres, mongodb}, data:{content}}) => {
    logger(`Multiclubes - Payments: ${content.KEY} - ${content.Member.Name}`)
    try {
        let id = md5(_.get(content, 'KEY', '')),
            filter = { '_id': id },
            model = { '_id': id, content: content },
            options = { postgres, mongodb, publish, content };

        await mongodb.sales_multiclubes_payments.upsert(filter, model);
        await paymentsCapture(options);
        done();
    } catch(err) {
        logger(`Error saving Multiclubes-Payments: ${err}`);
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Multiclubes.Payments.Post';

export { queue, register };
