import _ from 'lodash';
import axios from 'axios';
import { BASE_URL } from '~/constants';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
   (response) => {
    if (response.status >= 400) {
      let err = new Error('Request Error');
      err.response = response;
      throw err;
    }
    return response;
  },
  (error) => {
    if (_.get(error, 'response.status') === 401) {
      localStorage.removeItem('incanto');
      window.location.replace('/');
      return Promise.reject({
        error: { message: 'Acesse novamente o sistema!' },
      });
    } else {
      if (_.get(error, 'request.responseType') === 'blob'
          && _.get(error, 'response.data') instanceof Blob
          && (String(_.get(error, 'response.data.type'))).toLowerCase().indexOf('json') !== -1) {

         return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
              error.response.data = JSON.parse(reader.result);
              resolve(Promise.reject(error));
            };
            reader.onerror = () => {
              reject(error);
            };
            reader.readAsText(error.response.data);
         });
       };
       return Promise.reject(error);
    }
  }
);

axios.defaults.headers.common['Content-Type'] = 'application/json';

api.download = function(response, filename) {
  const url = window.URL.createObjectURL(new Blob([response.data])),
    link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;
