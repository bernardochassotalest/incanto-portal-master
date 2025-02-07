import {Schema} from 'mongoose'

const BulkTransactionSchema = new Schema({
    'Id': Number,
    'OwnerAccountId': Number,
    'OwnerUserId': Number,
    'CoownerUserId': Number,
    'Owner': {},
    'Coowner': {},
    'InvoiceId': Number,
    'InvoiceNumber': Number,
    'Date': String,
    'FinishDate': String,
    'PaymentDate': String,
    'PaymentMethod': String,
    'PaymentGroup': String,
    'BasePrice': Number,
    'DeliveryPrice': Number,
    'Price': Number,
    'Currency': String,
    'Status': {
        'Code': Number,
        'Name': String
    },
    'PaymentType': {
        'Code': Number,
        'Name': String
    },
    'PaymentGate': {
        'Code': Number,
        'Name': String
    },
    'ItemsCount': Number,
    'Championship': {
        'Code': String,
        'Name': String
    },
    'Match': {
        'Code': String,
        'Name': String,
        'Date': String
    },
    'Tag': String,
    'CreatedOn': String,
    'UpdatedOn': String,
}, { '_id': false })

const BulkBoughtProductsPriceComponents = new Schema({
    'Id': Number,
    'ProductType': String,
    'ProductId': Number,
    'ComponentName': String,
    'Total': Number
}, { '_id': false })

const BulkBoughtProductsSchema = new Schema({
    'Id': Number,
    'TransationId': Number,
    'ProductType': String,
    'ProductGroup': String,
    'ProductId': Number,
    'Product': {},
    'Operation': {
        'Code': Number,
        'Name': String
    },
    'ReturnType': {
        'Code': Number,
        'Name': String
    },
    'ReturnedId': Number,
    'OwnerUserId': Number,
    'StadiumId': Number,
    'Platform': String,
    'Sector': String,
    'Row': String,
    'Number': String,
    'SeatId': Number,
    'PriceName': String,
    'PriceGroupName': String,
    'PriceAreaName': String,
    'BasePrice': Number,
    'DeliveryPrice': Number,
    'Price': Number,
    'Discount': Number,
    'Fee': Number,
    'PriceTreshold': Number,
    'AttendenceDate': String,
    'AttendenceGate': String,
    'VindiPlanId': Number,
    'VindiProductId': Number,
    'Status': {
        'Code': Number,
        'Name': String
    },
    'PriceComponents': [BulkBoughtProductsPriceComponents],
    'CreatedOn': String,
    'UpdatedOn': String,
    'ItemTransactionID': Number,
    'UserID': Number,
    'OwnerUserID': Number,
    'Owner': {},
    'ProductID': Number,
    'StartDate': String,
    'EndDate': String,
    'Side': String,
    'SectorId': Number,
    'Seat': String,
    'Entrance': String,
    'Currency': String,
    'BookingDate': String,
    'BarcodeText': String,
    'VoucherName': String,
    'VoucherBatchName': String,
    'VoucherCodeUsed': String,
    'VoucherItemCode': String,
    'VoucherItemBatchName': String,
    'Attendance': Boolean,
    'AttendanceDate': String,
    'PaymentMethod': String,
    'ConnectedItemTransactionId': Number,
    'MasterTransactionId': Number,
    'ReturnEventId': Number,
    'ReturnNewTicketItemTransactionId': Number,
    'ReturnNewSeasonTicketItemTransactionId': Number,
}, { '_id': false })

const TransactionsPaymentsSchema = new Schema({
    'Id': Number,
    'TransactionId': Number,
    'Date': String,
    'PaymentGate': {
        'Code': String,
        'Name': String
    },
    'Details': {},
    'Conciliation': {
        'Acquirer': {
            'Code': String,
            'Name': String
        },
        'Date': String,
        'Time': String,
        'Amount': Number,
        'PointOfSale': String,
        'Reference': String,
        'Tid': String,
        'Nsu': String,
        'Authorization': String,
        'CardNumber': String,
        'CardBrand': String,
    }
}, { '_id': false })

const schema = new Schema({
    '_id': String,
    'TransactionDate': String,
    'BulkTransactions': BulkTransactionSchema,
    'BulkBoughtProducts': [BulkBoughtProductsSchema],
    'TransactionsPayments': [TransactionsPaymentsSchema]
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'TransactionDate': 1, 'BulkTransactions.OwnerUserId': 1 })
schema.index({ 'TransactionDate': 1, 'BulkTransactions.CoownerUserId': 1 })
schema.index({ 'TransactionDate': 1, 'BulkBoughtProducts.ProductId': 1 })

export default schema