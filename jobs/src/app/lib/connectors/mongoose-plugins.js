import mongoose from 'mongoose'
import debug from 'debug';
let loaded = false;

const log = debug('incanto:mongoose:plugins');

const upsertPlugin = (schema, options) => {
  schema.statics.upsert = async function(query, data) {
    let record = await this.findOne(query)
    if (!record) {
      record = new this(data)
    } else {
      Object.keys(data).forEach(k => {
        record[k] = data[k]
      })
    }
    return await record.save()
  }
}

export default async () => {
    if (!loaded) {
      mongoose.plugin(upsertPlugin)

      loaded = true;

      log('ok')      
    }
}
