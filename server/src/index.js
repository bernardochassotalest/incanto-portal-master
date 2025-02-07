process.env.NODE_PATH = __dirname
require('module').Module._initPaths()
require('dotenv').config({ path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env' });
require('./app')
