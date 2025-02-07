import {Schema} from 'mongoose'

const schema = new Schema({
    '_id': String,
    'UserId': Number,
    'AccountId': Number,
    'Identifier': String,
    'FirstName': String,
    'LastName': String,
    'Email': String,
    'VatNumber': String,
    'ContractNumber': String,
    'RegistryNumber': String,
    'PhoneNumber': String,
    'Consents': String,
    'Street': String,
    'HouseNumber': String,
    'ApartmentNumber': String,
    'Address2': String,
    'Address3': String,
    'Neighborhood': String,
    'State': String,
    'Postcode': String,
    'City': String,
    'Country': String,
    'MemberId': Number,
    'LoyaltyPoints': String,
    'LoyaltyLevel': String,
    'DateOfBirth': String,
    'DOB': String,
    'Role': {
        'Code': Number,
        'Name': String
    },
    'Gender': String,
    'IsErassed': Boolean,
    'ClientType': String,
    'BusinessAccount': Boolean,
    'AdminAccount': Boolean,
    'CashierAccount': Boolean,
    'NIP': String,
    'REGON': String,
    'CreatedOn': String,
    'UpdatedOn': String,
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'UserId': 1 })
schema.index({ 'Identifier': 1 })

export default schema