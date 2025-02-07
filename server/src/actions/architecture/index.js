import _ from 'lodash';
import got from 'got';
import { ACCOUNT_TYPES } from 'commons/constants';
import { loggedByToken } from 'middlewares';

export const INCLUDE_ACL = {
  code: 'A21',
  permissions: [],
  label: 'Documentação Técnica',
  icon: 'FaProjectDiagram',
  accounts: [ ACCOUNT_TYPES.SYSTEM ]
};

export const documentation = {
  method: 'get',
  isPublic: true,
  middlewares: [ loggedByToken ],
  run: async ({params, logger, response}) => {
    logger.debug('Documentation params=%j', params);

    const awsS3Url = process.env.AWS_PUBLIC,
      fileName = _.get(params, 'fileName', '');

    await got.stream(`${awsS3Url}/${fileName}`).pipe(response.raw());
  }
};
