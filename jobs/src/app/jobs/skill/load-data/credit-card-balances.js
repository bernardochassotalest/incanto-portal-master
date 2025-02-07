import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';
import { postgres } from 'app/models';
import { md5, getTimeLog } from 'app/lib/utils';

const log = debug('incanto:skill:accounting:loadCreditCardBalances');

export default {
    key: 'SkillLoadCreditCardBalances',
    async handle({ data, broker }) {
        try {
          await loadData(broker);
        } catch (err) {
          log(`Error: ${err}`)
        }
    }
};

const loadData = async (broker) => {
  log('[Start] Loading Creditcard Balances');

  let rows = await postgres.SaleAccountings.listLoadCreditCardBalances();

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
      model = {
        saleAccountingId: _.get(item, 'id', ''),
        type: 'creditCard',
        balance: _.get(item, 'amount', 0)
      };

    model['id'] = md5(`${model.saleAccountingId}-${model.type}`);

    await broker.publish('incanto.Skill.SaleAccountingBalance.Post', model)
  }

  log('[Finish] Loading Creditcard Balances');
}
