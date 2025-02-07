import _ from 'lodash'

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`SapB1 - ChartOfAccount: ${content.Code} - ${content.Name}`)
    const transaction = await postgres.ChartOfAccount.sequelize.transaction();

    try {
        const raw = {
                'acctCode': _.get(content, 'Code', ''),
                'acctName': _.get(content, 'Name', ''),
                'accountType': _.get(content, 'AccountType', ''),
                'titleAccount': _.get(content, 'TitleAccount', ''),
                'lockManual': _.get(content, 'LockManual', ''),
                'level': _.get(content, 'Level', ''),
                'group': _.get(content, 'Group', ''),
                'grpLine': _.get(content, 'GrpLine', ''),
                'lastDate': _.get(content, 'LastDate', '')
            };

        await postgres.ChartOfAccount.upsert(raw, { transaction });
        await transaction.commit();
        done()
    } catch(err) {
        logger(`Error saving ChartOfAccount: ${err}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.SapB1.ChartOfAccount.Post';

export { queue, register };
