import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:newc:actions');

export default {
    pooling: async (request, response) => {
        try {
            Queue.add('NewcProducts', {});

            response.json({error: false, message: 'Pooling started.'})
        } catch(err) {
            log(`Error: ${err}`);
            response.json({ error: true,  message : err })
        }
    }
}