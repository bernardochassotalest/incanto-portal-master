import { decodeToken } from 'commons/tools';
import { getParams } from 'libs/framework/http/utils';

export default ({ logger }) =>  (req, res, next) => {
  try {
    const params = getParams(req),
      token = params.token;

    if (!token) {
      throw 'Token inválido!'
    }

    if (!req.user) {
      req.user = decodeToken(`Bearer ${token}`);
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: error })
  }
}
