import _ from 'lodash';
import { format , formatDistance, parse, parseISO, startOfMonth, lastDayOfMonth, isValid } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { toast } from 'react-toastify';
import { ptBR } from 'date-fns/locale';

export const formats = {
  capitalize: (str) => {
    return !str ? '' : _.toLower(_.trim(str)).replace(/\w\S*/g, (w) => (w.replace(/^\w/, _.toUpper)));
  },
  phone: (str) => {
    let cleaned = onlyNumbers(str) || '',
      size = _.size(cleaned);
    if (![10, 11, 12, 13].includes(size)) {
      return str;
    }
    if (size === 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (size === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (size === 12) {
      return cleaned.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, '+$1 ($2) $3-$4');
    }
    return cleaned.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4');
  },
  cep: (str) => {
    let cleaned = onlyNumbers(str);
    return _.size(cleaned) !== 8 ? '' : cleaned.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3');
  },
  cnpj: (str) => {
    let cleaned = onlyNumbers(str);
    return _.size(cleaned) !== 14 ? '' : cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  },
  cpf: (str) => {
    let cleaned = onlyNumbers(str);
    return _.size(cleaned) !== 11 ? '' : cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  },
  cnpj_cpf: (str) => {
    let cleaned = onlyNumbers(str);
    return _.size(cleaned) === 11 ? formats.cpf(cleaned) : formats.cnpj(cleaned);
  },
  dateTimeZone: (date, mask = 'dd/MM/yyyy') => {
    let value = formats.getDate(date);
    value = isValid(value) ? value : '';
    return (!value) ? '' : format(zonedTimeToUtc(value, 'America/Sao_Paulo'), mask, { locale: ptBR });
  },
  date: (date, mask = 'dd/MM/yyyy') => {
    let value = formats.getDate(date);
    value = isValid(value) ? value : '';

    return (!value) ? '' : format(value, mask, { locale: ptBR });
  },
  getDate: (value) => {
    if (_.isDate(value) && !_.isString(value)) {
      return value;
    }
    return value && _.isString(value) ? parseISO(value) : null;
  },
  currency: (value=0, locale='pt-BR', currencyCode='BRL') => {
    let text = parseFloat(Math.abs(value)).toLocaleString(locale, { style: 'currency' , currency: currencyCode });
    return value < 0 ? `(${text})` : text;
  },
  percent: (value=0, locale='pt-BR') => {
    return parseFloat(value).toLocaleString(locale, { style: 'percent' });
  },
  decimal: (value=0, locale='pt-BR', decimalPlaces=2) => {
    return parseFloat(value).toLocaleString(locale, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
  },
  number: (value=0, locale='pt-BR', currencyLocale='BRL') => {
    return parseFloat(value).toLocaleString(locale);
  }
};

export const distanceDates = function(date, now, text) {
  if (date < now) {
    return text;
  }
  return formatDistance(parseISO(date), parseISO(now), { locale: ptBR });
};

export const getMonths = function() {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push({
      id: i,
      label: ptBR.localize.month(i)
    });
  }
  return months;
};

export const generateYears = function(left, rigth) {
  const now = new Date().getFullYear()
      , min = (now - left)
      , max = now + rigth
      , years = [];

  for (let i = min; i<=max; i++) {
    years.push(i);
  }

  return years;
};

export const parseStringToDecimal = (value='') => {
  let temp = String(value);
  temp = temp.replace(/[.]/g, '').replace(/[,]/g, '.').replace(/[\s]/g, '');
  return parseFloat(temp);
};

export const getLastDayOfMonthFromString = (value) => {
  try {
    const date = parse(value, 'dd/MM/yyyy', new Date());
    return formats.date(lastDayOfMonth(date), 'dd/MM/yyyy');
  } catch {
    return '';
  }
};

export const getFirstDayOfMonthFromString = (value) => {
  try {
    const date = parse(value, 'dd/MM/yyyy', new Date());
    return formats.date(startOfMonth(date), 'dd/MM/yyyy');
  } catch {
    return '';
  }
};

export const tryParseStringToDate = (value) => {
  const values = _.isArray(value) ? value : [value];
  const result = _.map(values, (it) => {
    const tmp = parse(it, 'dd/MM/yyyy', new Date());
    return isValid(tmp) ? tmp : null;
  });
  return _.isArray(value) ? result : _.first(result);
};

export const onlyNumbers = (value) => {
  if (!value) {
    return null;
  }
  return value.replace(/[^0-9]/g, '');
};

export const showMessage = (type, payload) => {
  let message = (type === 'error') ? getError(payload) : payload;
  toast[type](message);
};

export const getError = (payload) => {
  let message = _.get(payload, 'response.data.message') || _.get(payload, 'data.message') || _.get(payload, 'error.message')|| _.get(payload, 'message');

  if (!message) {
    console.error(payload)
  }
  return message || 'Falha na comunicação com o servidor. Tente novamente!';
};

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (email) => {
  return emailRegex.test(email);
};

export const isValidCpf = (cpf) => {
  if (cpf) {
    let val = cpf.replace(/[^\d]+/g, '');
    if (val === '') {
      return false;
    }
    if (val.length === 14) {
      val = val.replace(/\./g, '').replace(/-/, '');
    }
    if (val.length !== 11 ||
      val === '00000000000' || val === '11111111111' ||
      val === '22222222222' || val === '33333333333' ||
      val === '44444444444' || val === '55555555555' ||
      val === '66666666666' || val === '77777777777' ||
      val === '88888888888' || val === '99999999999') {
      return false;
    }
    let add = 0;
    for (let i = 0; i < 9; i++) {
      add += parseInt(val.charAt(i)) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(val.charAt(9))) {
      return false;
    }
    add = 0;
    for (let i = 0; i < 10; i++) {
      add += parseInt(val.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
      rev = 0;
    }
    if (rev !== parseInt(val.charAt(10))) {
      return false;
    }
    return true;
  }
  return false;
};

export const isValidCnpj = (cnpj) => {
  if (!cnpj) {
    return false;
  }
  let value = cnpj.replace(/[^\d]+/g, '');

  if (value === '' || value.length !== 14) {
    return false;
  }
  if (value === '00000000000000' || value === '11111111111111'
    || value === '22222222222222' || value === '33333333333333'
    || value === '44444444444444' || value === '55555555555555'
    || value === '66666666666666' || value === '77777777777777'
    || value === '88888888888888' || value === '99999999999999') {
    return false;
  }
  let size = value.length - 2,
    numbers = value.substring(0, size),
    digits = value.substring(size),
    sum = 0,
    pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2){
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (String(result) !== String(digits.charAt(0))) {
    return false;
  }
  size = size + 1;
  numbers = value.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2){
      pos = 9;
    }
  }
  let result2 = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (String(result2) !== String(digits.charAt(1))) {
    return false;
  }
  return true;
};

export const arrayInsertAt = (array, index, ...elements) => {
  array.splice(index, 0, ...elements);
};
