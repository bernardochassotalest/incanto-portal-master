import mongoose from 'mongoose'
import path from 'path'
import _ from 'lodash';
import Promise from 'bluebird'
import { dynamicLoad } from 'libs/framework/http/helper';

export default async (logger, modelsPath) => {
  if (!process.env.MONGODB_URL) {
    logger.warn('The environment variables to start MongoDb, not found!')
    return
  }
  const options = {
    reconnectTries: process.env.MONGODB_RECONNECT_TRIES || Number.MAX_VALUE,
    reconnectInterval: process.env.MONGODB_RECONNECT_INTERVAL || 1000,
    socketTimeoutMS: process.env.MONGODB_TIMEOUT || 0,
    poolSize: process.env.MONGODB_POOL_SIZE || 5,
    keepAlive: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }

  await mongoose.connect(process.env.MONGODB_URL, options)
	mongoose.Promise = Promise
  const models = await dynamicLoad(path.resolve(modelsPath, 'mongodb'))
  
  logger.debug('MongoDb models initialized: %s', _.keys(models).join(', '));
  logger.info('MongoDb connected!')
}
