import _ from 'lodash';
import fs from 'fs'
import debug from 'debug';
import { postgres } from 'app/models';
import { removeFile } from 'app/lib/utils';

const log = debug('incanto:skill:reports:cron');

export default {
  key: 'SkillReportsCron',
  options: { repeat: { cron: '00 5 * * *' } },
  async handle({ data }) {
    try {
      log('Limpando relatórios');

      let rows = await postgres.ReportRequests.listToRemove();

      for (let i = 0; i < rows.length; i++) {
        let item = rows[i],
          id = _.get(item, 'id', ''),
          fileName = _.get(item, 'fileName', '');

        if (fs.existsSync(fileName)) {
          await removeFile(fileName);
        }

        await postgres.ReportRequests.destroy({where: {id}});
      }
    } catch (err) {
      log(`Error: ${err}`)
    }
  }
};
