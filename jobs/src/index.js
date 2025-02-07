let cfgEnv = (process.env.NODE_ENV === 'production' ? '' : (process.env.NODE_ENV === 'test' ? '.test' : '.development'));
require('dotenv').config({ path: `.env${cfgEnv}` });
require('./server');
