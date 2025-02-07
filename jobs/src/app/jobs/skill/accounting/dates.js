import debug from 'debug';
import _ from 'lodash';
import { postgres } from 'app/models';
import { addDays, format } from 'date-fns'

const log = debug('incanto:skill:conciliation:dates');

export default {
    key: 'SkillConciliationDates',
    options: { repeat: { cron: '30 3 * * *' } },
    async handle({ data }) {
        const transaction = await postgres.Conciliations.sequelize.transaction();

        try {
            let start = new Date();
            for (var i = -2; i < 32; i++) {
                let current = addDays(start, i),
                    day = format(current, 'yyyy-MM-dd'),
                    content = { date: day, status: 'open' },
                    where = { date: day },
                    found = await postgres.Conciliations.findOne({ where }, { transaction });
                if (!found) {
                    await postgres.Conciliations.create(content, { transaction })
                }
            }

            await transaction.commit();
        } catch(err) {
            await transaction.rollback();
            log(`Error: ${err}`);
        }

        log('Ok');
    }
};