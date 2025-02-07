process.env.NODE_PATH = require('path').resolve(__dirname, '..', '..');
require('module').Module._initPaths();
require('dotenv').config({ path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env' });
require('./app');
