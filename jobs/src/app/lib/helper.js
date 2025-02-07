import _ from 'lodash';
import Intl from 'intl';
import { format, parseISO, parse, startOfMonth, lastDayOfMonth, isValid } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const formats = {
  phone: (str) => {
    let cleaned = onlyNumbers(str);
    return _.size(cleaned) !== 11 ? '' : cleaned.replace(/^(\d{2})(\d{4})(\d{5})$/, '($1) $2-$3');
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
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(value);
  },
  percent: (value=0, locale='pt-BR') => {
    return new Intl.NumberFormat(locale, { style: 'percent' }).format(value);
  },
  decimal: (value=0, locale='pt-BR', decimalPlaces=2) => {
    return new Intl.NumberFormat(locale, { style: 'decimal', minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(value);
  }
}

export const parseStringToDecimal = (value='') => {
  let temp = String(value);
  temp = temp.replace(/[.]/g, '').replace(/[,]/g, '.').replace(/[\s]/g, '');
  return parseFloat(temp);
}

export const getLastDayOfMonthFromString = (value) => {
  try {
    const date = parse(value, 'dd/MM/yyyy', new Date());
    return formats.date(lastDayOfMonth(date), 'dd/MM/yyyy');
  } catch (err) {
    return '';
  }
}

export const getFirstDayOfMonthFromString = (value) => {
  try {
    const date = parse(value, 'dd/MM/yyyy', new Date());
    return formats.date(startOfMonth(date), 'dd/MM/yyyy');
  } catch (err) {
    return '';
  }
}

export const tryParseStringToDate = (value) => {
  const values = _.isArray(value) ? value : [value];
  const result = _.map(values, (it) => {
    const tmp = parse(it, 'dd/MM/yyyy', new Date());
    return isValid(tmp) ? tmp : null;
  });
  return _.isArray(value) ? result : _.first(result);
}

export const onlyNumbers = (value) => {
  if (!value) {
    return null;
  }
  return value.replace(/[^0-9]/g, '');
}

export const getError = (payload) => {
  let message = _.get(payload, 'response.data.message') || _.get(payload, 'error.message');

  if (!message) {
    console.error(payload)
  }
  return message || 'Falha na comunicação com o servidor. Tente novamente!';
}

export const isBuffer = (obj) => {
  return obj != null
    && obj.constructor != null
    && typeof obj.constructor.isBuffer === 'function'
    && obj.constructor.isBuffer(obj)
}
