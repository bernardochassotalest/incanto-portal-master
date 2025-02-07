import _ from 'lodash';
import fs from 'fs';
import path from 'path'
import debug from 'debug';
import axios from 'axios';
import FormData from 'form-data'
import vindiConfig from 'config/vindi';
import { postgres } from 'app/models';

const log = debug('incanto:vindi:import-batches');

export default {
  key: 'VindiImportBatches',
  async handle({ data }) {
    log('Executing:Start');
    if (vindiConfig.lockFiles == false) {
      await checkStatus();
      await processSlip();
      await processDirectDebit();
    }

    log('Executing:Finish');
  }
};

const checkStatus = async () => {
  const list = await postgres.VindiImportBatches.listCreated();

  log('Checking status...');
  for (let i = 0; i < list.length; i++) {
    let item = list[i],
      id = _.get(item, 'id', ''),
      fileName = `${item.filePath}/${item.fileName}`,
      accountSlip = _.get(item, 'accountSlip', ''),
      countSlip = _.toNumber(_.get(item, 'countSlip', '0')),
      countDebit = _.toNumber(_.get(item, 'countDebit', '0')),
      fileType = _.get(item, 'type', ''),
      payMethodCode = '', payCompanyCode = '', status = 'discarded';

    if ((countSlip + countDebit) > 0) {
      if (fs.existsSync(fileName)) {
        status = 'pending';
        const paymentConfig = _.findLast(vindiConfig.paymentMethods, { type: `itau_${_.first(_.split(fileType, '-'))}` });
        if (_.isEmpty(paymentConfig) == false) {
          payMethodCode = paymentConfig.methodCode;
          payCompanyCode = paymentConfig.companyCode;
        }
        if (accountSlip == '90000') {
          payMethodCode = 'online_bank_slip_';
        } else if (accountSlip == '31065') {
          payMethodCode = 'online_bank_slip';
        }
      }
    }

    await postgres.VindiImportBatches.update({ status, payMethodCode, payCompanyCode }, {where: { id }});
  }
}

const processFiles = async (type) => {
  var idFile = '';

  try {
    const list = await postgres.VindiImportBatches.listPending(type),
      paymentConfig = _.findLast(vindiConfig.paymentMethods, { type: `itau_${_.first(_.split(type, '-'))}` });

    for (let i = 0; i < list.length; i++) {
      let item = list[i],
        id = _.get(item, 'id', ''),
        fileName = `${item.filePath}/${item.fileName}`,
        paymentMethodCode = _.get(item, 'payMethodCode', ''),
        paymentCompanyCode = _.get(paymentConfig, 'companyCode', '');

      const url = `${vindiConfig.url}import_batches`,
            form = new FormData(),
            stream = fs.createReadStream(fileName),
            formHeaders = form.getHeaders(),
            options = { headers: { ...formHeaders }, auth: vindiConfig.auth };

      form.append('payment_method_code', paymentMethodCode);
      form.append('payment_company_code', paymentCompanyCode);
      form.append('batch', stream);

      idFile = id;
      const response = await axios.post(url, form, options);
      const content = _.get(response, 'data.import_batch', ''),
        batchId = _.get(content, 'id', ''),
        batchStatus = _.get(content, 'status', ''),
        batchResult = JSON.stringify(_.cloneDeep(content));

      await postgres.VindiImportBatches.update({ status: 'processed', batchId, batchStatus, batchResult }, {where: { id }});
    }
  } catch (error) {
    log(`Error: ${error}`)
    if (error.response) {
      const batchResult = JSON.stringify(_.cloneDeep(error.response.data));
      await postgres.VindiImportBatches.update({ status: 'error', batchResult }, {where: { id: idFile }});
    }
  }
}

const processSlip = async () => {
  log('Processing slip...');
  await processFiles('boleto')
}

const processDirectDebit = async () => {
  log('Processing direct-debit...');
  await processFiles('debito-240')
}
