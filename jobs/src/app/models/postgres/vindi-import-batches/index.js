import _ from 'lodash';
import { postgres } from 'app/models'
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

class VindiImportBatches extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      status: DataTypes.ENUM(['created', 'pending', 'discarded', 'processed', 'error']),
      source: DataTypes.STRING,
      type: DataTypes.STRING,
      fileName: DataTypes.STRING,
      filePath: DataTypes.STRING,
      payMethodCode: DataTypes.STRING,
      payCompanyCode: DataTypes.STRING,
      batchId: DataTypes.STRING,
      batchStatus: DataTypes.STRING,
      batchResult: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'vindiImportBatches'
    });
  }

  static async listCreated() {
    let querySlipCount = `
         (Select Count('a')
          From "slipOccurrences" T10
               INNER JOIN "slipTransactions" T11 ON T11."id" = T10."transactionId"
          Where T10."fileName" = "vindiImportBatches"."fileName" and T11."tag" = 'avanti')`,
      querySlipAccount = `
         (Select Max(T11."account")
          From "slipOccurrences" T10
               INNER JOIN "slipTransactions" T11 ON T11."id" = T10."transactionId"
          Where T10."fileName" = "vindiImportBatches"."fileName" and T11."tag" = 'avanti')`,
      queryDebit = `
         (Select Count('a')
          From "directDebitOccurrences" T10
               INNER JOIN "directDebitTransactions" T11 ON T11."id" = T10."transactionId"
          Where T10."fileName" = "vindiImportBatches"."fileName" and T11."tag" = 'avanti')`,
      attributes = ['id', 'filePath', 'fileName', 'type',
                    [literal(_.trim(querySlipAccount)),  'accountSlip'],
                    [literal(_.trim(querySlipCount)),  'countSlip'],
                    [literal(_.trim(queryDebit)), 'countDebit']],
      where = { status: 'created' };
    return await this.findAll({ attributes, where, raw: true })
  }

  static async listPending(type) {
    let attributes = ['id', 'filePath', 'fileName', 'payMethodCode', 'payCompanyCode'],
      where = { status: 'pending', type };
    return await this.findAll({ attributes, where, raw: true })
  }
}

export default VindiImportBatches;
