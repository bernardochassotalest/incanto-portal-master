import { hashSync } from 'bcrypt-nodejs';
import { generatePassword } from 'commons/tools';
import { v4 as uuidv4 } from 'uuid';
import * as helper from 'libs/framework/http/helper';
import { mail } from 'commons/jobs';

const logger = helper.logger({}, 'models/postgres/user')

export const createPassword = async () => {
  const password = generatePassword(6);
  const hash = await hashSync(password);
  return { password, hash }
}

export const createHash = () => {
  return uuidv4()
}

export const sendMail = async (user, tmpPassword, reset = false) => {
  user.account = await user.getAccount();

  const data = {
    reset,
    email: user.email,
    name: user.name,
    password: tmpPassword,
    url: process.env.APP_URL
  }

  logger.debug('Enviando email para %s', data.email)
  await mail.userAccess(data, reset);
}
