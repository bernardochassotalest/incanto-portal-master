import axios from 'axios';
import _ from 'lodash';
import { onlyNumbers } from 'commons/helper';

const parse = function(data) {
  let parts = String(_.get(data, 'telefone') || '').split('/'),
    phone = (parts[0] || '').replace(/\D/g, ''),
    zipCode = (_.get(data, 'cep') || '').replace(/\D/g, ''),
    businessAreas = [];

  const capitalize = (obj, field) => _.chain(obj).get(field).toLower().startCase().value();

  if (data.atividade_principal) {
    businessAreas = businessAreas.concat(_.map(data.atividade_principal, (r) => onlyNumbers(r.code)))
  }
  if (data.atividades_secundarias) {
    businessAreas = businessAreas.concat(_.map(data.atividades_secundarias, (r) => onlyNumbers(r.code)))
  }

  return {
    name: capitalize(data, 'nome'),
    tradeName: capitalize(data, 'fantasia'),
    phone,
    businessAreas,
    address: {
      address: capitalize(data, 'logradouro'),
      number: _.get(data, 'numero'),
      complements: capitalize(data, 'complemento'),
      block: capitalize(data, 'bairro'),
      zip_code: zipCode,
      city: capitalize(data, 'municipio'),
      state: _.get(data, 'uf'),
    }
  }
}

export const search = async function(cnpj='') {
  try {
    cnpj = cnpj.replace(/\D/g, '');
    const { data = {} } = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, { timeout: 5000 });
    if (_.get(data, 'status') === 'ERROR') {
      throw new ApiError(_.get(data, 'message', ''));
    }
    return {
      identify: cnpj,
      identifyType: 'company',
      active: true,
      ...parse(data)
    };
  } catch (error) {
    throw new ApiError(error);
  }
}
