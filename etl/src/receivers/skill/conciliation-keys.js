import _ from 'lodash';

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
  if (_.isEmpty(content) == false) {
    const transaction = await postgres.ConciliationKeys.sequelize.transaction();

    try {
      for (let i = 0; i < content.length; i++) {
        let model = content[i];
        logger(`Skill - ConciliationKeys: ${model.conciliationItemId} - ${model.keyId}`)
        await postgres.ConciliationKeys.upsert(model, { returning: false, transaction });
      }

      await transaction.commit();

      done()
    } catch(err) {
      logger(`Error saving ConciliationKeys: ${err}`);
      await transaction.rollback();
      throw err;
    }
  }
}

const register = (params) => {
  saveData(params)
};

const queue = 'incanto.Skill.ConciliationKeys.Post';

export { queue, register };

