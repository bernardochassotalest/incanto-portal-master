import _ from 'lodash'
import winston from 'winston'

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

module.exports = {
  dialect: 'postgres',
  logging: log(),
  host: process.env.POSTGRES_HOST || 'localhost',
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'docker',
  database: process.env.POSTGRES_DATABASE || 'dev-incanto',
  pool: {
    max: 10, // DEFAULT: 5
    min: 0,
    acquire: (60 * 1000),  // DEFAULT: 30000
    idle: (20 * 1000), // DEFAULT: 10000
  },
  dialectOptions: {
    requestTimeout: (5 * 1000),
    idle_in_transaction_session_timeout: (30 * 1000),
    // statement_timeout: (2 * 1000),
  },
  define: {
    timestamps: true,
    underscore: true
  }
}
