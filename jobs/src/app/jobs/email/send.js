import Mail from 'app/lib/mail';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import debug from 'debug';

const log = debug('incanto:email:user-access');

export default {
  key: 'SendEmail',
  async handle({ data }) {
    log(`Sending generic mail data: ${JSON.stringify(_.omit(data, 'contents'))} `);

    await Mail.sendMail({
      from: `${process.env.MAIL_SENDER_NAME || 'Portal'} <${process.env.MAIL_SENDER}>`,
      to: `${data.name} <${data.email}>`,
      subject: data.subject,
      html: template({data, template: 'generic-mail.html'})
    });
  },
};

const template = ({template, data}) => {
	const templateText = String(fs.readFileSync(path.join(__dirname, '../../resources/email/' + template)))
	return _.template(templateText)({ 'params': data });
};
