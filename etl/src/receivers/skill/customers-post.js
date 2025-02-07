import _ from 'lodash';
import { globalCustomer } from './customers';

const saveData = async({logger, done, models: {postgres}, data:{content}}) => {
    const contentC = _.get(content, 'content', {}),
          contentR = _.get(content, 'reference', {});

    logger(`Skill - Customers: ${contentC.vatNumber} - ${contentR.sourceId}`)

    try {
        let ok = await globalCustomer({ postgres, logger, ...content });
        if (ok == true) {
            done()
        }
    } catch(err) {
        logger(`Error saving Customers: ${err}`);
        throw err;
    }
}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Skill.Customers.Post';

export { queue, register };
