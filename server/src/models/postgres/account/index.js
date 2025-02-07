import { Model, DataTypes } from 'sequelize';
import _ from 'lodash';

import { ACCOUNT_TYPES } from 'commons/constants';

class Account extends Model {
  static init(sequelize) {
    super.init(
      {
        active: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        accountType: DataTypes.ENUM(_.values(ACCOUNT_TYPES)),
      },
      {
        sequelize,
        modelName: 'accounts',
        hooks: {
          beforeCreate: this.hasBeforeCreate,
        }
      }
    );
  };

  static async hasBeforeCreate(account, options) {
    try {
      const count = await this.count({
        where: {
          email: account.email,
        },
      });
      if (count > 0) {
        return Promise.reject(new Error('Conta já está cadastrada!'));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default Account;
