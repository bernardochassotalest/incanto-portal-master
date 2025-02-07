import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'models/mongodb/skill/auth/schema'

export default mongoose.model('auth_logs', schema, 'c_auth_logs')
