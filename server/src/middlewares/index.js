import upload from 'middlewares/upload'
import logged from 'middlewares/logged'
import loggedByToken from 'middlewares/logged-token';
import authorizate from 'middlewares/authorizate'

export {
  authorizate, logged, loggedByToken, upload
}
