import _ from 'lodash'

const register = async ({logger, done, publish, models: {postgres}, data:{content}}) => {
	try {
		let type = _.get(content, 'Type', ''),
			action = _.get(content, 'Action', ''),
			group = 'SapB1';

		if (_.includes(_.toLower(type), 'multiclubes') === true) {
			group = 'Multiclubes';
			type = _.replace(type, 'Multiclubes', '');
		}

	    let name = `incanto.${group}.${type}.${action}`,
	    	body = JSON.parse(_.get(content, 'Content', ''));
	    await publish(name, body);
    } catch(err) {
        throw err;
    } finally {
    	done()
    }
};

const queue = 'incanto.SapB1.Results';

export { queue, register };
