let cfgEnv = (process.env.NODE_ENV === 'production' ? '' : (process.env.NODE_ENV === 'test' ? 'test' : 'development'));
require('dotenv').config({ path: `.env.${cfgEnv}` });

process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();
global.PAGE_SIZE = process.env.PAGE_SIZE * 1

import MoongosePlugins from 'app/lib/connectors/mongoose-plugins'
MoongosePlugins()

import path from 'path';
import PostgresConnector from 'app/lib/connectors/postgres-connector';
import MongooseConnector from 'app/lib/connectors/mongoose-connector';
import Queue from 'app/lib/queue';
import debug from 'debug';

const log = debug('incanto');

PostgresConnector(path.resolve(__dirname, 'app', 'models'));
MongooseConnector(path.resolve(__dirname, 'app', 'models'));
Queue.process();

log('Queue Jobs running...');