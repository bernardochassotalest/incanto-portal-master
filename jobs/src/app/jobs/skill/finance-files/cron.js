import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';

const log = debug('incanto:skill:finances:cron');

export default {
    key: 'SkillFinanceFilesCron',
    options: { repeat: { cron: '06,16,26,36,46,56 * * * *' } },
    // options: { repeat: { cron: '06,16,26,36,46,56 23 * * *' } },
    async handle({ data }) {
        try {
            Queue.add('SkillFinanceFilesFolder', {});
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};