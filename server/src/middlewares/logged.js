import _ from 'lodash'
import {decodeToken} from 'commons/tools'

export default ({logger}) =>  (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization']

    if (!token) {
      throw 'Token inválido!'
    }

    if (!req.user) {
      req.user = decodeToken(token);
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: error })
  }
}
