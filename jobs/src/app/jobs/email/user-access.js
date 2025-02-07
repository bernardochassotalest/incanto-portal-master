import Mail from 'app/lib/mail';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import debug from 'debug';

const log = debug('incanto:email:user-access');

export default {
  key: 'UserAccessEmail',
  async handle({ data }) {
    let isReset = data.reset

    data.title = !isReset ? 'Dados de acesso' : 'Sua senha foi redefinida';
    data.url = process.env.NEW_USER_URL;

    log(`Sending user access data: ${JSON.stringify(data)} `);

    await Mail.sendMail({
      from: `${process.env.MAIL_SENDER_NAME || 'Portal'} <${process.env.MAIL_SENDER}>`,
      to: `${data.name} <${data.email}>`,
      subject: (!isReset) ? 'Dados de Acesso - Portal' : 'Senha Redefinida - Portal',
      html: template({data, template: 'user-access.html'})
    });
  },
};

const template = ({template, data}) => {
	const templateText = String(fs.readFileSync(path.join(__dirname, '../../resources/email/' + template)))
	return _.template(templateText)({ 'params': data });
};
