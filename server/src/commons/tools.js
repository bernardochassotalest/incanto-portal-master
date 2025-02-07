import _ from 'lodash';
import fs from 'fs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { parse, isValid } from 'date-fns';

const algorithm = 'aes-256-cbc';
const key = 'ACC1ED1A24RE5355C7B60934D73E0E30';
const iv = crypto.randomBytes(16);

export const md5 = (text) => crypto.createHash('md5').update(text).digest('hex');

export const generatePassword = (size) => Math.random().toString(36).slice(-size);

export const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    , encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  let data = { a: iv.toString('hex'), b: encrypted.toString('hex') }
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

export const decrypt = (text) => {
  let data =JSON.parse(Buffer.from(text, 'base64').toString())
    , iv = Buffer.from(data.a, 'hex')
    , encryptedText = Buffer.from(data.b, 'hex')
    , decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
    , decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const removeFile = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch(err) {
    return err
  }
}

export function decodeToken(token) {
  const arr = token.split(' ')
  if (arr[0] === 'Bearer') {
    return jwt.verify(arr[1], process.env.JWT_SECRET)
  }
  throw 'server:auth.error.invalidToken'
}

/**
 * Don't use number from class Number, only use a number form class String
 * @param {String as number ==> "120,03" to 120.03} value
 */
export function numberStringToDecimal(value) {
  if (!value || value.length === 0) return 0;
  let temp = String(value);
  temp = temp.replace(/[\.]/g, '').replace(/[,]/g, '.').replace(/[\s]/g, '');
  return parseFloat(temp);
}

export const tryParseStringToDate = (value) => {
  const values = _.isArray(value) ? value : [value];
  const result = _.map(values, (it) => {
    const tmp = parse(it, 'dd/MM/yyyy', new Date());
    return isValid(tmp) ? tmp : null;
  });
  return _.isArray(value) ? result : _.first(result);
}
