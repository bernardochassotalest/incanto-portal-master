const _  = require('lodash')
const winston = require('winston')
require('dotenv').config({ path: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env' });

const log = () => {
  const logType = _.toString(_.toUpper(process.env.SEQUELIZE_LOG));

  if (logType == 'CONSOLE') {
    return console.log;
  } else if (logType == 'WINSTON') {
    const filename = `${process.env.DIR_ATTACHMENT}/sequelize/postgres.log`,
      logger = winston.createLogger({
        level: 'info',
        transports: [
          new winston.transports.File({ filename }),
        ],
      });

    return (msg) => logger.info(`${new Date().toISOString()} - ${msg}`);
  }

  return false;
}

let configuration = {
  dialect: 'postgres',
  logging: log(),
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  define: {
    timestamps: true,
    underscore: true
  }
}

if (process.env.NODE_ENV !== 'production' && process.env.SQLITE_DATABASE) {
  configuration = {
    dialect: 'sqlite',
    storage: process.env.SQLITE_DATABASE,
    transactionType: 'IMMEDIATE',
    retry: {
      max: 10
    },
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000,
      handleDisconnects: true
  }
  }
}

module.exports = configuration;
