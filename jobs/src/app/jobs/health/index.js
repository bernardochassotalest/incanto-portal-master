import debug from 'debug';

const log = debug('incanto:health-check');

export default {
  key: 'HealthCheck',
  options: { repeat: { cron: '0,30 * * * *' } },
  handle({ data }) {
    log('Ok');
    return Promise.resolve({})
  }
}
