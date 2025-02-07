import _ from 'lodash'
import debug from 'debug';
import { postgres } from '../../models';

class Utils {
  constructor () {
    this.id = new Date();
    this.list = [];
    this.logger = debug('incanto:utils');
    this.load();
  }

  async load() {
    if (_.isEmpty(this.list) == true) {
      this.list = await postgres.AccountingModels.list();
    }
  }

  async getGroup(model) {
    let result = model;
    try {
      let filter = { 'id': model },
        found = _.findLast(this.list, filter);
      if (found) {
        result = _.get(found, 'group', '');
      }
    } catch (error) {
      this.logger(`publish: ${error}`);
      throw error;
    }
    return result;
  }
}

const instance = () => new Utils();

module.exports = instance;
