import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

class ConciliationMessages extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      memo: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize, modelName: 'conciliationMessages'
    });
  }

  static associate(models) {
    this.belongsTo(models.conciliations, { foreignKey: 'date', sourceId: 'date', as: 'conciliationData' });
    this.belongsTo(models.messageTypes, { foreignKey: 'messageId', sourceId: 'id', as: 'messageData' });
    this.hasOne(models.sourceMappings, { sourceKey: 'sourceId', foreignKey: 'id', as: 'mappingData' });
    this.hasOne(models.accountConfigs, { sourceKey: 'sourceId', foreignKey: 'id', as: 'acctData' });
  }

  static async listNotification() {
    let where = { isActive: true },
      attributes = ['date'],
      group = ['conciliationMessages.date', 'messageData.id', 'messageData.name'],
      order = [['date', 'ASC']],
      include = [{
         model: postgres.MessageTypes,
         as: 'messageData',
         required: true,
         attributes: ['id', 'name']
      }];
    return await this.findAll({ attributes, where, include, group, order })
  }

  static async listDashboard(from, to) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        isActive: true
      },
      attributes = ['sourceName', [sequelize.fn('count', sequelize.col('name')), 'count']],
      include = [{
        model: postgres.MessageTypes,
        as: 'messageData',
        required: true,
        attributes: ['id', 'name']
      }],
      group = ['conciliationMessages.sourceName', 'messageData.id', 'messageData.name'],
      order = [
        ['messageData', 'name', 'ASC'],
        ['sourceName', 'ASC']
      ],
      list = await this.findAll({where, attributes, include, group, order, raw: true });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          ruleCode: _.get(row, 'messageData.id', ''),
          ruleName: _.get(row, 'messageData.name', ''),
          source: _.capitalize(_.get(row, 'sourceName', '')),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: 0,
          filterConfig: {
            messageType: _.get(row, 'messageData.id', ''),
            startDate: from,
            endDate: to,
          }
        };
      data.push(item);
    }

    return data;
  };

  static async listDashboardSapB1(messageType, from, to, offset, limit) {
    let where = {
        messageId: messageType,
        isActive: true,
        date: { [Op.gte]: from, [Op.lte]: to },
        memo: { [Op.ne]: '' }
      },
      attributes = ['id', 'memo'],
      include = [{
        model: postgres.MessageTypes,
        as: 'messageData',
        required: true,
        attributes: ['name']
      }];

    let { count = 0, rows = [] } = await this.findAndCountAll({where, attributes, include, offset, limit, raw:true });
    const data = rows.map((o) => {
      let memo = _.get(o, 'memo', ''),
        row = {
          id: _.get(o, 'id', ''),
          group: _.get(o, 'messageData.name', ''),
          description: `ERRO: ${memo}`,
        };
      return row;
    })
    return data;
  }

  static async listDashboardMapping(messageType, from, to, offset, limit) {
    let where = {
        messageId: messageType,
        isActive: true,
        sourceDb: 'sourceMappings',
        date: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['id', 'memo'],
      include = [{
        model: postgres.MessageTypes,
        as: 'messageData',
        required: true,
        attributes: ['name']
      }, {
        model: postgres.SourceMapping,
        as: 'mappingData',
        required: true,
        attributes: ['id', 'source', 'name']
      }];

    let { count = 0, rows = [] } = await this.findAndCountAll({where, attributes, include, offset, limit, raw:true });
    const data = rows.map((o) => {
      let mapId = _.get(o, 'mappingData.id', ''),
        mapSource = _.get(o, 'mappingData.source', ''),
        mapName = _.get(o, 'mappingData.name', ''),
        row = {
          id: _.get(o, 'id', ''),
          group: _.get(o, 'messageData.name', ''),
          description: `Origem: ${mapSource} - Código: ${mapId} - Descrição: ${mapName}`,
        };
      return row;
    })
    return data;
  }

  static async listDashboardAccounting(messageType, from, to, offset, limit) {
    let where = {
        messageId: messageType,
        isActive: true,
        sourceDb: 'accountConfigs',
        date: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['id', 'memo'],
      include = [{
        model: postgres.MessageTypes,
        as: 'messageData',
        required: true,
        attributes: ['name']
      }, {
        model: postgres.AccountConfig,
        as: 'acctData',
        required: true,
        attributes: ['validFrom', 'source', 'item'],
        include: [{
          model: postgres.AccountingModel,
          as: 'accountingModel',
          required: true,
          attributes: ['name']
        }]
      }];

    let { count = 0, rows = [] } = await this.findAndCountAll({where, attributes, include, offset, limit, raw:true });
    const data = rows.map((o) => {
      let mapValidFrom = _.get(o, 'acctData.validFrom', ''),
        mapSource = _.get(o, 'acctData.source', ''),
        mapItem = _.get(o, 'acctData.item', ''),
        mapGroup = _.get(o, 'acctData.accountingModel.name', ''),
        row = {
          id: _.get(o, 'id', ''),
          group: _.get(o, 'messageData.name', ''),
          description: `Grupo: ${mapGroup} - Valido Desde: ${mapValidFrom} - Origem: ${mapSource} - Código: ${mapItem}`,
        };
      return row;
    })
    return data;
  }

  static async listDashboardDetail(messageType, from, to, offset) {
    let limit = PAGE_SIZE,
      data = [];

    offset = isNaN(offset) ? 0 : offset * 1;

    data = _.concat(data, await this.listDashboardSapB1(messageType, from, to, offset, limit));
    data = _.concat(data, await this.listDashboardMapping(messageType, from, to, offset, limit));
    data = _.concat(data, await this.listDashboardAccounting(messageType, from, to, offset, limit));

    return { rows: data, offset, count: data.length, limit };
  }
}

export default ConciliationMessages;

