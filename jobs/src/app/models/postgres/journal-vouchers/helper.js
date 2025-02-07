import _ from 'lodash';
import { Op } from 'sequelize';
import { postgres } from 'app/models'

export const getParameters = (options) => {
  const { tags, from, to, group, sourceDb, extraInclude, extraOrder } = options;
  let where = {
      tag: { [Op.in]: tags },
      refDate: { [Op.gte]: from, [Op.lte]: to },
      group: { [Op.in]: group }
    },
    attributes = ['transId', 'refDate', 'taxDate', 'dueDate'],
    include = [],
    order = [],
    groupModel = {
      model: postgres.AccountingModelGroups,
      as: 'groupData',
      required: true,
      attributes: ['name']
    },
    acctModel = {
      model: postgres.AccountingItems,
      as: 'acctItems',
      required: true,
      attributes: ['tag', 'amount', 'jeId', 'debitLineId', 'creditLineId'],
      where: { sourceDb },
      include: extraInclude
    };

  if (_.isEmpty(extraInclude) == false) {
    acctModel['include'] = extraInclude;
  }
  include.push(groupModel);
  include.push(acctModel);

  order.push(['groupData', 'name', 'ASC']);
  order.push(['acctItems', 'tag', 'ASC']);
  order.push(['refDate', 'ASC']);
  order.push(['taxDate', 'ASC']);
  if (_.isEmpty(extraOrder) == false) {
    order.push(extraOrder);
  }
  order.push(['acctItems', 'amount', 'DESC']);

  return { where, attributes, include, order };
}
