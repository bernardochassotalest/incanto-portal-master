import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:skill:accounting:cron');

export default {
    key: 'SkillAccountingCron',
    options: { repeat: { cron: '00,10,20,30,40,50 * * * *' } },
    async handle({ data, broker }) {
        Queue.add('SkillAccountingGenerate', {});
        log('Ok');
    }
};
