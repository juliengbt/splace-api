import Knex from 'knex';
import { globals } from './globals';
import logger from './logger';

const conf: Knex.Config = {
  client: 'mysql2',
  version: '8.0',
  connection: {
    host: globals.DB.HOST,
    user: globals.DB.USER,
    password: globals.DB.PASSWORD,
    database: globals.DB.DATABASE,
  },
  pool: { min: 2, max: 10 },
  log: {
    debug: (message: string) => logger.debug(message),
    warn: (message: string) => logger.warn(message),
    error: (message: string) => logger.error(message),
    deprecate: (message: string) => logger.warn(message),
  },
};

const db: Knex = Knex(conf);

db.select(1)
  .then(() => logger.info('Base de données connectée.'))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });

export default db;
