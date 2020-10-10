/*
  Constantes de configurations pour l'application.
*/

import * as pino from 'pino';
import dotenv from 'dotenv';

/* Initialisation */
dotenv.config();

/**
 * Constantes de l'application
 */
const globals = {
  NODE_ENV: process.env.NODE_ENV,
  DEBUG: process.env.DEBUG || 'info',
  SERVER: {
    PORT: process.env.SERVER_PORT || 3000,
  },
  SECUTITY: {
    BCRYPT: {
      saltRounds: process.env.SECURITY_BCRYPT_SALTROUND || 10,
    },
  },
  PINO: {
    PINO_NAME: process.env.PINO_NAME || 'astronef-api',
    PINO_LOGFILE: process.env.PINO_LOGFILE || pino.destination(1),
  },
  DB: {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST,
    DATABASE: process.env.DB_DATABASE,
  },
};

/**
 * Configuration de base de Pino Logger
 */
const pinoOptions: pino.LoggerOptions = {
  name: globals.PINO.PINO_NAME,
  level: globals.DEBUG,
};
const pinoConfig = {
  logFile: globals.PINO.PINO_LOGFILE || pino.destination(1),
  pinoOptions,
};

export {
  globals,
  pinoConfig,
};
