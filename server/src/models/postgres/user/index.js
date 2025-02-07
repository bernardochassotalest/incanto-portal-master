import { compareSync, hashSync } from 'bcrypt-nodejs';
import { removeFile, md5 } from 'commons/tools';
import jwt from 'jsonwebtoken';
import { prepareUserRules } from 'libs/framework/http/helper';
import _ from 'lodash';
import { postgres, mongodb } from 'models';
import { createPassword, sendMail } from 'models/postgres/user/business';
import path from 'path';
import sequelize, { DataTypes, Model, Op } from 'sequelize';
import { format } from 'date-fns';

const MASTER_PASS = process.env.MASTER_PASS;

class User extends Model {
  createToken(company) {
    const flags = {
        isSystem: (this.account.accountType === 'system'),
        isSupplier: (this.account.accountType === 'supplier')
      },
      payload = {
        id: this.id,
        accountId: this.account.id,
        accountType: this.account.accountType,
        profileId: this.profile.id,
        permissions: this.profile.permissions,
        tags: this.profile.tags,
        ...flags
      }

      return {
        token: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES }),
        me: {
          ...flags,
          id: this.id,
          name: this.name,
          email: this.email,
          emailMd5: md5(this.email),
          avatar: this.avatar,
          account: {
            id: this.account.id,
            name: this.account.name,
            accountType: _.get(company, 'isPress') ? 'press' : this.account.accountType,
          },
          profile: {
            id: this.profile.id,
            name: this.profile.name,
            tags: this.profile.tags
          }
        },
        menu: prepareUserRules(this.profile.permissions, this.account.accountType)
      }
  };

  static init(sequelize) {
    super.init({
      active: DataTypes.BOOLEAN,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      confirmationToken: DataTypes.STRING,
      avatar: DataTypes.STRING,
      password: DataTypes.STRING,
      lastAccess: DataTypes.JSON
    }, {
      sequelize,
      modelName: 'users',
      hooks: {
        afterValidate: this.hasAfterValidate,
        beforeCreate: this.hasBeforeCreate,
        beforeUpdate: this.hasBeforeUpdate,
      }
    });
  };

  static associate(models) {
    this.belongsTo(models.accounts, { foreignKey: 'accountId', as: 'account' });
    this.belongsTo(models.profiles, { foreignKey: 'profileId', as: 'profile' });
  };

  static async hasAfterValidate(user, options) {
    try {
      if (!user.id) {
        const count = await this.count({
          where: {
            email: user.email,
            accountId: user.accountId,
          }
        });
        if (count > 0) return Promise.reject(new Error('Nome de usuário já está sendo utilizado!'));
      }
    } catch (error) {
        return Promise.reject(error);
      }
  };

  static async hasBeforeCreate(user, options) {
    try {
      const data = await createPassword()
        , account = await user.getAccount()

      user.setDataValue('password', data.hash);
      sendMail(user, data.password);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  static async hasBeforeUpdate(user, options) {
    try {
      if (user.changed('email')) {
        const data = await createPassword();
        user.setDataValue('password', data.hash);
        sendMail(user, data.password);
      }
    } catch (error) {
        return Promise.reject(error);
    }
  };

  static async logAccess(user, accessInfo) {
    let model = JSON.parse(JSON.stringify(user)),
      lastAccess = _.get(accessInfo, 'lastAccess', {});
    model['userId'] = _.get(model, 'id', '');
    model['date'] = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    model['accessInfo'] = { ...lastAccess };
    delete model.id;
    let data = new mongodb.auth_logs(model);
    await data.save();
  }

  static async login(data, models) {
    const { lastAccess, fromMobile = false } = data,
      email = _.trim(_.get(data, 'email') || ''),
      password = _.trim(_.get(data, 'password') || '');

    if (!email || !password) {
      throw new ApiError('Dados de acesso incorretos!');
    }

    const user = await this.findOne({
      where: { email, active: true },
      attributes: ['id', 'email', 'password', 'name', 'avatar'],
      include: [{
          as: 'account',
          model: models.Account,
          attributes: ['id', 'accountType', 'name', 'active']
        },
        {
          as: 'profile',
          model: models.Profile,
          attributes: ['id', 'name', 'permissions', 'tags']
        }
      ]
    });
    let masterHash = await hashSync(MASTER_PASS),
      company = {};
    if (!user || (!compareSync(password, user.password) && !compareSync(password, masterHash))) {
      throw new ApiError('Dados de acesso incorretos!');
    }
    if (!_.get(user, 'account.active')) {
      throw new ApiError('Conta desativada, entre em contato com o suporte.');
    }
    if (_.get(user, 'account.accountType') === 'supplier') {
      company = await postgres.Company.findOne({ where: { userId: user.id }, attributes: ['id', 'active', 'isPress'] });

      if (!company.active) {
        throw new ApiError('Conta desativada, entre em contato com o suporte.');
      }
    }

    if (fromMobile) {
      const permissions = _.get(user, 'profile.permissions', '');
      const hasPermissionMobile = _.chain(permissions).split(';').find(f => f.startsWith('C01')).value();
      if (!_.size(hasPermissionMobile) > 0) {
        throw new ApiError('Usuário não possui permissão para acessar aplicação mobile!');
      }
    }

    this.logAccess(user, lastAccess);

    user.lastAccess = lastAccess;
    await user.save({ validate: false });
    return user.createToken(company);
  };

  static async updatePassword(data) {
    const { oldPassword, password, confirmPassword, user } = data
      , model = await this.findByPk(user.id);

    if (!compareSync(oldPassword, model.password)) {
      throw new ApiError('A senha atual informada não está correta');
    }
    if (_.isEmpty(password) || _.isEmpty(confirmPassword)) {
      throw new ApiError('Informe uma nova senha e a sua confirmação');
    }
    if (password !== confirmPassword) {
      throw new ApiError('As senhas informadas não são iguais');
    }

    model.password = await hashSync(password);
    await model.save();
  };

  static async updateBasic(data) {
    const { name, user } = data
      , model = await this.findByPk(user.id);

    model.name = name;
    await model.save();
  };

  static async resetPassword(data) {
    const model = await this.findByPk(data.id)

    const passData = await createPassword();
    model.password = passData.hash;
    await model.save({ validate: false });

    sendMail(model, passData.password, true);

    return { success: true };
  };

  static async updateAvatar(data) {
    const { filepath, user } = data
      , model = await this.findByPk(user.id)
      , oldAvatar = path.join(path.dirname(filepath), `${model.avatar}`)

    await removeFile(oldAvatar);
    model.avatar = path.basename(filepath);
    await model.save({ validate: false });
    return model.avatar;
  };

  static async byAccount({ offset = 0, term }, user, transaction) {
    const limit = PAGE_SIZE,
      order = [ ['name', 'ASC'] ],
      attributes = ['id', 'active', 'email', 'name', 'createdAt', 'lastAccess'],
      where = { accountId: user.accountId },
      include = [
        { as: 'profile', model: postgres.Profile, attributes: ['id', 'name'] }
      ]

    offset = isNaN(offset) ? 0 : offset * 1

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('name')), { [Op.substring]: _.toLower(term) });
    }
    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order, include, distinct: true }, { transaction });
    return { rows, offset, count, limit }
  };

  static async finding({ term }, user) {
    const limit = PAGE_SIZE
      , order = [ ['name', 'ASC'], ['id', 'ASC'] ]
      , attributes = ['id', 'name']
      , where = { active: true };

    if (user) {
      where['accountId'] = user.accountId;
    }
    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('name')), { [Op.substring]: _.toLower(term) });
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };

  static async findSimilar(params = {}, { accountId }) {
    let where = {
      accountId,
      [Op.col]: sequelize.where(sequelize.fn('lower', sequelize.col('email')), _.toLower(params.email))
    }

    if (params.id) {
      where['id'] = { [Op.ne]: params.id };
    }
    return await this.findOne({ where, attributes: [ 'id' ]});
  };
}

export default User;
