import sequelize, { Model, DataTypes, Op } from 'sequelize';

class MulticlubesPayments extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      paymentId: DataTypes.STRING,
      itemPaymentId: DataTypes.STRING,
      titleId: DataTypes.STRING,
      titleNumber: DataTypes.STRING,
      memberVatNumber: DataTypes.STRING,
      memberName: DataTypes.STRING,
      type: DataTypes.STRING,
      mode: DataTypes.STRING,
      paidDate: DataTypes.STRING,
      paidAmount: DataTypes.DECIMAL(13, 2),
      dunInstitution: DataTypes.STRING,
      dunBranch: DataTypes.STRING,
      dunAccount: DataTypes.STRING,
      dunDueDate: DataTypes.STRING,
      dunOurNumber: DataTypes.STRING,
      dunReturnFile: DataTypes.STRING,
      tefInstitution: DataTypes.STRING,
      tefCardType: DataTypes.STRING,
      tefDate: DataTypes.STRING,
      tefTime: DataTypes.STRING,
      tefNsu: DataTypes.STRING,
      tefAuthNumber: DataTypes.STRING,
      tefTid: DataTypes.STRING,
      tefCardNumber: DataTypes.STRING,
      tefParcelType: DataTypes.STRING,
      tefParcelQty: DataTypes.STRING,
      tefHolderName: DataTypes.STRING,
      checkInstitution: DataTypes.STRING,
      checkDueDate: DataTypes.STRING,
      checkNumber: DataTypes.STRING,
      checkOwner: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'multiclubesPayments'
    });
  }

  static associate(models) {
    this.hasMany(models.multiclubesParcels, { foreignKey: 'paymentId', as: 'parcelsData' });
  }

}

export default MulticlubesPayments;
