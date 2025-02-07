import _ from 'lodash'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`SapB1 - Project: ${content.Code} - ${content.Name}`)
    const transaction = await postgres.Project.sequelize.transaction();

    try {
        const raw = {
                'prjCode': _.get(content, 'Code', ''),
                'prjName': _.get(content, 'Name', '')
            };

        await postgres.Project.upsert(raw, { transaction });
        await transaction.commit();
        done()
    } catch(err) {
        logger(`Error saving Project: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.SapB1.Project.Post';

export { queue, register };
