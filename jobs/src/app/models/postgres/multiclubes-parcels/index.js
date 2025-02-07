import sequelize, { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'app/models'

class MulticlubesParcels extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      saleId: DataTypes.STRING,
      saleDate: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      productId: DataTypes.STRING,
      productName: DataTypes.STRING,
      productGroup: DataTypes.STRING,
      accountingGroup: DataTypes.STRING,
      dependentName: DataTypes.STRING,
      dependentParentage: DataTypes.STRING,
      parcelId: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      parcelAmount: DataTypes.DECIMAL(13, 2),
      interestAmount: DataTypes.DECIMAL(13, 2),
      arrearsAmount: DataTypes.DECIMAL(13, 2),
      discountAmount: DataTypes.DECIMAL(13, 2),
      downPayment: DataTypes.DECIMAL(13, 2),
      amountDue: DataTypes.DECIMAL(13, 2),
      paidAmount: DataTypes.DECIMAL(13, 2),
    },
    {
      sequelize, modelName: 'multiclubesParcels'
    });
  }

  static associate(models) {
    this.hasMany(models.multiclubesPayments, { foreignKey: 'paymentId', as: 'paymentsData' });
  }

}

export default MulticlubesParcels;
