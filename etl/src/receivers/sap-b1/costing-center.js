import _ from 'lodash'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`SapB1 - CostingCenter: ${content.Code} - ${content.Name}`)
    const transaction = await postgres.CostingCenter.sequelize.transaction();

    try {
        const locked = _.toLower(_.toString(_.get(content, 'Locked'))) || '',
          raw = {
                'ocrCode': _.get(content, 'Code', ''),
                'ocrName': _.get(content, 'Name', ''),
                'locked': (locked == 'true' ? true : false)
            };

        await postgres.CostingCenter.upsert(raw, { transaction });
        await transaction.commit();
        done()
    } catch(err) {
        logger(`Error saving CostingCenter: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.SapB1.ProfitCenter.Post';

export { queue, register };
