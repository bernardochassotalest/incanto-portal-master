import { postgres } from 'app/models'
import vindiConfig from 'config/vindi';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class VindiExportBatches extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      status: DataTypes.STRING,
      url: DataTypes.STRING,
      createDate: DataTypes.STRING,
      updateDate: DataTypes.STRING,
      paymentType: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      paymentName: DataTypes.STRING,
      paymentCode: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileStatus: DataTypes.ENUM(['pending', 'exported', 'removed']),
    },
    {
      sequelize, modelName: 'vindiExportBatches'
    });
  }

  static async list(fileStatus) {
    let attributes = ['id', 'url', 'fileName', 'paymentType'],
      where = { fileStatus };
    return await this.findAll({ attributes, where, raw: true })
  }
}

export default VindiExportBatches;
