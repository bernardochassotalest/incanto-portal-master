import Queue from 'bull';
import redisConfig from 'config/redis';
import rabbitConfig from 'config/rabbit';
import * as jobs from 'app/jobs';
import _ from 'lodash';
import debug from 'debug';
import * as Broker from "./broker";

const log = debug('incanto:queue');
const BROKER = Broker.instance(rabbitConfig.url);

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, { redis: {...redisConfig} }),
  name: job.key,
  handle: job.handle,
  options: job.options,
}))

process.on('SIGTERM', () => { BROKER.disconnect(); });

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find(queue => queue.name === name);
    const {delay} = data;
    queue.options = queue.options || {};
    queue.options.delay = delay || _.get(queue, 'options.delay');
    return queue.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach(queue => {
      const handle = (data) => {
        data.broker = BROKER;
        queue.handle(data);
      }
      queue.bull.process(handle);

      queue.bull.on('failed', (job, err) => {
        log('Job failed', queue.name, job.data);
        console.error(err);
      });

      queue.bull.on('completed', (job) => {
        job.remove();
      });
    })
  }
};
