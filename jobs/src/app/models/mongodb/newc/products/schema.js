import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'ProductId': Number,
    'ProductType': String,
    'Name': String,
    'Tournament': String,
    'FederationReportPriceTreshold': Number,
    'StadiumId': Number,
    'StadiumName': String,
    'StartDate': String,
    'EndDate': String,
    'CreatedOn': String,
    'UpdatedOn': String,
    'ProductDate': String,
    'AddressName': String,
    'Postcode': String,
    'City': String,
    'Country': String,
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'ProductId': 1 })

export default schema