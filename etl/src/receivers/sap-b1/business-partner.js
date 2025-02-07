import _ from 'lodash'
import { onlyNumbers } from '../../lib/helper';

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    logger(`SapB1 - BusinessPartner: ${content.Code} - ${content.Name}`)
    const transaction = await postgres.BusinessPartner.sequelize.transaction(),
          cardCode = _.get(content, 'Code', '');

    try {
        const bpGroup = {
                'grpCode': _.toNumber(_.get(content, 'Group.Code', '')),
                'grpName': _.get(content, 'Group.Name', '')
            },
            cpf = onlyNumbers(_.get(content, 'CPF', '')),
            cnpj = onlyNumbers(_.get(content, 'CNPJ', '')),
            bpData = {
                'cardCode': _.get(content, 'Code', ''),
                'cardName': _.get(content, 'Name', ''),
                'tradeName': _.get(content, 'TradeName', ''),
                'type': _.get(content, 'Type', ''),
                'vatNumber': (_.isEmpty(cnpj) == false ? cnpj : cpf),
                'grpCode': _.toNumber(_.get(content, 'Group.Code', '')),
                'account': _.get(content, 'Account.Code', ''),
                'lastDate': _.get(content, 'lastDate', ''),
            };

        await postgres.BpGroup.upsert(bpGroup, { transaction });
        await postgres.BusinessPartner.upsert(bpData, { transaction });
        await transaction.commit();
        done()
    } catch(err) {
        logger(`Error saving BusinessPartner: ${err} - ${cardCode}`);
        await transaction.rollback();
        throw err;
    }
}

const register = (params) => {
	saveData(params)
};

const queue = 'incanto.SapB1.BusinessPartner.Post';

export { queue, register };
