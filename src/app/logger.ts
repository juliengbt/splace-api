import pino from 'pino';
import { pinoConfig } from './globals';

const logger = pino(pinoConfig.pinoOptions);

export default logger;
