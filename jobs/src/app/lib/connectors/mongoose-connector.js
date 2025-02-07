import mongoose from 'mongoose'
import Promise from 'bluebird'
import debug from 'debug';
import path from 'path';
import _ from 'lodash';
import mongoConfig from 'config/mongodb';

const log = debug('incanto:mongo');
export const dynamicLoad = (p) => import(p);

export default async (modelsPath) => {
  if (!mongoConfig.url) {
    log('The environment variables to start MongoDb, not found!')
    return
  }

  await mongoose.connect(mongoConfig.url, mongoConfig.options)
  mongoose.Promise = Promise
  const models = await dynamicLoad(path.resolve(modelsPath, 'mongodb'))

  log('MongoDb models initialized: %s', _.keys(models).join(', '));
  log('MongoDb connected!')
}
