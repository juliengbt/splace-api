import dotenv from 'dotenv';
import helmet from 'helmet';
import Server from './server/server'
import bodyparser from 'body-parser'

// Config file
dotenv.config();

const serv = new Server();

//Security / optimization
serv.app.use(helmet());

// support parsing of application/json type post data
serv.app.use(bodyparser.json());

serv.start()

