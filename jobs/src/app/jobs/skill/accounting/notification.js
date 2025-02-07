import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';
import { postgres } from 'app/models';
import fileConfig from 'config/files';

const log = debug('incanto:skill:accounting:notification');

export default {
    key: 'SkillAccountingNotification',
    async handle({ data, broker }) {
        try {
          await sendMessages();
        } catch (err) {
          log(`Error: ${err}`)
        }
    }
};

const sendMessages = async () => {
  let rows = await postgres.ConciliationMessages.listNotification(),
    content = '<table><th><td>Data</td><td>Mensagem</td></th>';

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i];
    content += `<tr><td>${item.date}</td><td>${item.messageData.name}</td></tr>`
  }
  content += '</table>'

  let users = await postgres.User.listNotification();

  for (let i = 0; i < users.length; i++) {
    let user = users[i],
      options = {
        name: _.get(user, 'name', ''),
        email: _.get(user, 'email', ''),
        subject: '[INCANTO] Existe configurações contábeis para serem revisadas',
        contents: content
      };
    Queue.add('SendEmail', options);
  }
}
