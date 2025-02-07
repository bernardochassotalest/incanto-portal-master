import _ from 'lodash';
import fs from 'fs';
import path from 'path'
import debug from 'debug';
import axios from 'axios';
import fileConfig from 'config/files';
import vindiConfig from 'config/vindi';
import { moveFile } from 'app/lib/utils'
import { postgres } from 'app/models';

const log = debug('incanto:vindi:export-batches');

export default {
  key: 'VindiExportBatches',
  async handle({ data }) {
    if (vindiConfig.lockFiles == false) {
      let cronMinute = (new Date()).getMinutes();
      if (cronMinute > 45) {
        log('Removing');
        await removeFiles();
      } else {
        log('Executing');
        const paymentMethods = vindiConfig.paymentMethods;
        for (let i = 0; i < paymentMethods.length; i++) {
          let payMethod = paymentMethods[i];
          await executeProcess(payMethod);
        }
      }
    }
  }
};

const executeProcess = async (payMethod) => {
  await createExportBatches(payMethod);
  await exportFiles(payMethod);
}

const createExportBatches = async (payMethod) => {
  try {
    let url = `${vindiConfig.url}export_batches`,
      options = {
        headers: {
          'Content-Type': 'application/json'
        },
        auth: vindiConfig.auth,
      },
      data = {
        'payment_method_code': payMethod.methodCode,
        'payment_company_code': payMethod.companyCode
      },
      response = await axios.post(url, data, options),
      content = _.get(response, 'data.export_batch', '');

    if (_.isEmpty(content) == false) {
      let urlFile = _.get(content, 'url', ''),
        expression = new RegExp(/(?:[^\/][\-\d\w\.]+)\.rem/ig),
        match = urlFile.match(expression),
        data = {
          id: _.toString(_.get(content, 'id', '')),
          status: _.get(content, 'status', ''),
          url: urlFile,
          createDate: _.get(content, 'created_at', ''),
          updateDate: _.get(content, 'updated_at', ''),
          paymentType: _.get(payMethod, 'type', ''),
          paymentId: _.toString(_.get(content, 'payment_method.id', '')),
          paymentName: _.get(content, 'payment_method.name', ''),
          paymentCode: _.get(content, 'payment_method.code', ''),
          fileName: _.first(match),
          fileStatus: 'pending',
        };
      if (_.isEmpty(urlFile) == false) {
        await postgres.VindiExportBatches.upsert(data);
      }
    }
  } catch (err) {
    log(`Error: ${err}`)
    if (err.response) {
      log(`Detail: ${JSON.stringify(err.response.data, null, 2)}`);
    }
  }
}

const exportFiles = async (payMethod) => {
  try {
    let rows = await postgres.VindiExportBatches.list('pending');
    for (let i = 0; i < rows.length; i++) {
      let { id, url, fileName } = rows[i],
        options = { responseType: 'stream' },
        response = await axios.get(url, options);

      response.data.pipe(fs.createWriteStream(`${vindiConfig.exportBatchesPath}/${payMethod.type}/${fileName}`));

      await postgres.VindiExportBatches.update({ fileStatus: 'exported' }, { where: { id } });
    }
  } catch (err) {
    log(`Error: ${err}`)
  }
}

const approveExportBatches = async(id) => {
  try {
    let url = `${vindiConfig.url}export_batches/${id}/approve`,
      options = {
        headers: {
          'Content-Type': 'application/json'
        },
        auth: vindiConfig.auth,
      },
      data = {},
      response = await axios.post(url, data, options),
      content = _.get(response, 'data.export_batch', ''),
      status = _.get(content, 'status', ''),
      updateDate = _.get(content, 'updated_at', '');

      await postgres.VindiExportBatches.update({ status, updateDate }, { where: { id } });

  } catch (err) {
    log(`Error: ${err}`)
    if (err.response) {
      log(`Detail: ${JSON.stringify(err.response.data, null, 2)}`);
    }
  }
}

const removeFiles = async () => {
  try {
    let rows = await postgres.VindiExportBatches.list('exported');

    for (let i = 0; i < rows.length; i++) {
      let { id, fileName, paymentType } = rows[i],
        sourceFile = `${vindiConfig.exportBatchesPath}/${paymentType}/${fileName}`;

      if (fs.existsSync(sourceFile)) {
        const processedFolder = path.join(fileConfig.folders.server, fileConfig.van, 'processed');
        let targetFile = path.join(processedFolder, path.basename(sourceFile));

        await moveFile(sourceFile, targetFile)
      }

      await approveExportBatches(id);

      await postgres.VindiExportBatches.update({ fileStatus: 'removed' }, { where: { id } });
    }

  } catch (err) {
    log(`Error: ${err}`)
  }
}
