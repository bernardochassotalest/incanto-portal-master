import _ from 'lodash';
import axios from 'axios'
import { format } from 'date-fns';
import { md5, getTimeLog, delay } from '../../lib/utils'
import acquirersConfig from '../../config/acquirers';
const SkillUtils = require('./utils')();

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - AccountingItems - POST: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.AccountingItems.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'sourceDb', 'sourceId', 'refDate', 'taxDate', 'dueDate',
                                     'tag', 'accountItem', 'amount', 'pointOfSale', 'championshipId',
                                     'matchId', 'extraMemo']),
            saleCaptured = _.get(content, 'saleCaptured', ''),
            salePecld = _.get(content, 'salePecld', ''),
            saleAccounting = _.get(content, 'saleAccounting', ''),
            url = _.get(content, 'url', ''),
            acctModel = _.get(content, 'model', ''),
            acctGroup = await SkillUtils.getGroup(acctModel);

        if (_.isNumber(model.amount) == false) {
            model.amount = 0;
        }
        if (_.isEmpty(model.tag) == true) {
            model.tag = '';
        }
        if (_.isEmpty(model.pointOfSale) == true) {
            model.pointOfSale = '';
        }
        if (_.isEmpty(model.championshipId) == true) {
            model.championshipId = '';
        }
        if (_.isEmpty(model.matchId) == true) {
            model.matchId = '';
        }
        if (_.isEmpty(model.extraMemo) == true) {
            model.extraMemo = '-' + _.toUpper(model.tag);
        }

        let jeId = [];
        jeId.push(model.refDate);
        jeId.push(model.taxDate);
        jeId.push(model.dueDate);
        jeId.push(model.tag);
        jeId.push(acctGroup);
        if ((acquirersConfig.groupAccounting === 'ponto_venda') &&
        		(_.isEmpty(model.pointOfSale) == false)) {
            jeId.push(model.pointOfSale);
            model.extraMemo += '-' + model.pointOfSale;
        }
        if (_.isEmpty(model.matchId) == false) {
          jeId.push(model.matchId);
        }

        model['jeId'] = md5(_.join(jeId, '-'));
        model['timeLog'] = getTimeLog();

        await postgres.AccountingItems.upsert(model, { transaction });
        if (_.isEmpty(saleCaptured) == false) {
          let { status, id } = saleCaptured;
          await postgres.Sales.update({ isCaptured: status }, { where: { id: id }, transaction });
        }
        if (_.isEmpty(salePecld) == false) {
          let { status, id } = salePecld;
          await postgres.Sales.update({ isPecld: status }, { where: { id: id }, transaction });
        }
        if (_.isEmpty(saleAccounting) == false) {
          let raw = { accountingItemId: model.id, ...saleAccounting },
            saleAcctId = [], balances = _.get(saleAccounting, 'balances', []);
          saleAcctId.push(raw.saleId);
          saleAcctId.push(raw.accountingItemId);
          raw['id'] = md5(_.join(saleAcctId, '-'));
          await postgres.SaleAccountings.upsert(raw, { transaction });
          for (let i = 0; i < balances.length; i++) {
            let itemBalance = balances[i],
              dataBalance = {
                saleAccountingId: raw.id,
                type: _.get(itemBalance, 'type', ''),
                balance: _.get(itemBalance, 'balance', 0)
              };
            dataBalance['id'] = md5(`${raw.id}-${dataBalance.type}`)
            await postgres.SaleAccountingBalances.upsert(dataBalance, { transaction });
          }
        }
        await transaction.commit();

        if (_.isEmpty(url) == false) {
          await delay(1500);
          await axios.post(url, {});
        }

        done()
    } catch(err) {
        logger(`Error saving AccountingItems: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.AccountingItems.Post';

export { queue, register };
