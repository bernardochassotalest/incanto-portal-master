import _ from 'lodash'
import { md5 } from '../../lib/utils'

const saveData = async({logger, done, models: {postgres, mongodb}, data:{content}}) => {
    logger(`Multiclubes - Sales: ${content.KEY} - ${content.Member.Name}`)

    try {
        let id = md5(_.get(content, 'KEY', '')),
            model = { '_id': id, content: content },
            filter = { '_id': id };

        await mongodb.sales_multiclubes_sales.upsert(filter, model);
        done();
    } catch(err) {
        logger(`Error saving Multiclubes-Sales: ${err}`);
        throw err;
    }

}

const register = (params) => {
    saveData(params)
};

const queue = 'incanto.Multiclubes.Sales.Post';

export { queue, register };
