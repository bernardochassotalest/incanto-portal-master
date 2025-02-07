import _ from 'lodash';
import debug from 'debug';
import { md5, getParams, getTimeLog } from 'app/lib/utils'
import { mongodb } from 'app/models';
import { format } from 'date-fns';
import Queue from 'app/lib/queue';

const log = debug('incanto:vindi:actions');

export default {
    webhook: async (request, response) => {
        try {
            let params = getParams(request),
                auth = _.get(params, 'auth', ''),
                password = md5('sep1914@vindi'),
                model = { content: _.get(params, 'event', {}) }

            _.set(model, 'content.timeLog', getTimeLog());

            if (auth != password) {
                return response.status(500).send({error: true, message: 'Invalid password'})
            }

            var instance = new mongodb.sales_vindi_events(model)
            await instance.save()

            response.json({error: false, message: instance._id})
        } catch(err) {
            log(`Error: ${err}`);
            response.json({ error: true,  message : err.message })
        }
    },
    pooling: async (request, response) => {
        try {
            Queue.add('VindiProducts', {});

            response.json({error: false, message: 'Pooling started.'})
        } catch(err) {
            log(`Error: ${err}`);
            response.json({ error: true,  message : err })
        }
    }
}
