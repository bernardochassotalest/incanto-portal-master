import _ from 'lodash'
import { getAuthKey } from 'libs/framework/http/helper'

export default ({logger, module, acls}) => (req, res, next) => {
  try {
    const authKey = getAuthKey(module),
      permissionList = (!acls) ? null : (_.isArray(acls) ? acls : [ acls ])

    let user = req.user
    if (!user) {
      return res.status(403).json({ message: 'Acesso negado!' })
    }
    if (user.isAdmin) {
      return next()
    }
    let deny = (authKey && user && String(user.permissions).indexOf(authKey) < 0)
    if (deny) {
      return res.status(403).json({ message: 'Não autorizado!' })
    }
    let allowed = (_.get(`;${user.permissions};`.match(new RegExp(`;${authKey}+(.*?);`)), '[1]') || '').replace(/\+/g, '').split(',')

    if (!_.isEmpty(acls) && _.size(_.intersection(allowed, permissionList)) !== _.size(permissionList)) {
      return res.status(403).json({ message: 'Você não tem permissão!' })
    }
    next()
  } catch (error) {
    return res.status(401).json({ message: error })
  }
}
