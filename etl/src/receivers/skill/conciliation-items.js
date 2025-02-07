import _ from 'lodash';

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`Skill - ConciliationItems: ${content.id} - ${content.sourceId}`)
    const transaction = await postgres.ConciliationItems.sequelize.transaction();

    try {
        let model = _.pick(content, ['id', 'date', 'rule', 'sourceName', 'sourceDb', 'sourceId', 'pointOfSale',
                                     'keyCommon', 'keyTid', 'keyNsu', 'credit', 'debit', 'balance' ]);

        if (_.isNumber(model.credit) == false) {
            model.credit = 0;
        }
        if (_.isNumber(model.debit) == false) {
            model.debit = 0;
        }
        if (_.isNumber(model.balance) == false) {
            model.balance = 0;
        }

        await postgres.ConciliationItems.upsert(model, { transaction });

        await transaction.commit();

        done()
    } catch(err) {
        logger(`Error saving ConciliationItems: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.ConciliationItems.Post';

export { queue, register };
