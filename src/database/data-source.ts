import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import { APP_ENTITIES } from 'src/utils/constants';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const config = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.get('DB_HOST') || 'localhost',
  port: Number(config.get('DB_PORT')) || 3306,
  username: config.get('DB_USER') || 'root',
  password: config.get('DB_PASSWORD') || config.get('DB_ROOT_PASSWORD'),
  database:
    config.get('NODE_ENV') === 'test' ? config.get('DB_TEST_DATABASE') : config.get('DB_DATABASE'),
  entities: APP_ENTITIES,
  synchronize: config.get('NODE_ENV') === 'production' ? false : true,
  logging:
    config.get('NODE_ENV') === 'production' || !Boolean(Number(config.get('DEBUG')))
      ? ['error']
      : ['error', 'info', 'log', 'query', 'warn'],
  migrations: ['dist/migrations/*.js']
};

export default new DataSource(dataSourceOptions);
