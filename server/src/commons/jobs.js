import axios from 'axios';
import _ from 'lodash';
import debug from 'debug';
import requestLib from 'request';

const log = debug('white:jobs');
const url = process.env.JOBS_URL;

export const mail = {

  userAccess: async (data) => {
    try {
      log(`Acessando ${url}/email/user-access`);
      await axios.post(`${url}/email/user-access`, data);
    } catch (error) {
      throw new ApiError(error);
    }
  },

  send: async (data) => {
    try {
      log(`Acessando ${url}/email/send`);
      await axios.post(`${url}/email/send`, data);
    } catch (error) {
      throw new ApiError(error);
    }
  },

  sendCredentials: (formData) => {
    let options = {
      uri: `${url}/email/send-credentials`,
      method: 'POST',
      formData
    };
    log(`Acessando ${url}/email/send-credentials`);

    return new Promise((resolve, reject) => {
      requestLib(options, (err, res, body) => {
        if (err) {
          reject(err)
        }
        resolve(body)
      });
    });
  },

  excelReports: async (data) => {
    try {
      log(`Acessando ${url}/skill/reports/process`);
      await axios.post(`${url}/skill/reports/process`, data);
    } catch (error) {
      throw new ApiError(error);
    }
  },

};


