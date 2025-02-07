import instance from 'libs/framework/http/instance';
import path from 'path';

instance({
  name: 'incanto',
  actions: path.join(__dirname, 'actions'),
  models: path.join(__dirname, 'models'),
  logger: {
    path: path.join(__dirname, '../'),
    maxLogFiles: 10,
    fileLog: false,
    level: 'log'
  }
})
