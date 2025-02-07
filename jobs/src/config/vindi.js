import _ from 'lodash';

const paymentMethods = () => {
  let result = [],
    types = _.split(process.env.VINDI_PAYMENT_TYPE, ','),
    methodCode = _.split(process.env.VINDI_PAYMENT_METHOD_CODE, ','),
    companyCode = _.split(process.env.VINDI_PAYMENT_COMPANY_CODE, ',');

  for (let i = 0; i < types.length; i++) {
    let item = {
          type: types[i],
          methodCode: methodCode[i],
          companyCode: companyCode[i]
        };
    result.push(item);
  }

  return result;
}

export default {
    url: process.env.VINDI_APIURL,
    updatedUntil: process.env.VINDI_UPDATED_UNTIL,
    exportBatchesPath: process.env.VINDI_EXPORT_BATCHES,
    paymentMethods: paymentMethods(),
    lockFiles: (_.toString(process.env.VINDI_LOCK_FILES) == 'true' ? true : false),
    auth: {
        'username': process.env.VINDI_APIKEY,
        'password': ''
    }
};
