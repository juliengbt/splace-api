import { registerAs } from '@nestjs/config/dist/utils/register-as.util';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME
}));
