import dotenv from 'dotenv';
import helmet from 'helmet';
import bodyparser from 'body-parser';
import Server from './server/server';

// Config file
dotenv.config();

const serv = new Server();

// Security / optimization
serv.app.use(helmet());

// support parsing of application/json type post data
serv.app.use(bodyparser.json());
// to support URL-encoded bodies
serv.app.use(bodyparser.urlencoded({
  extended: true,
}));

serv.start();
