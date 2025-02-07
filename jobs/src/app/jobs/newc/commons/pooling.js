import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:newc:pooling');

export default {
    key: 'NewcPooling',
    //options: { repeat: { cron: '35 * * * *' } },  //TODO: Retornar após mapeamentos da Bilheteria
    async handle({ data, broker }) {

        Queue.add('NewcProducts', {});

        log('Ok');
    }
};
