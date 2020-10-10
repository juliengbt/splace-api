import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';

import { RegisterRoutes } from './routes';
import { globals } from './globals';
import notFoundHandler from './middlewares/notFoundHandler';
import errorHandler from './middlewares/errorHandler';

const app = express();

/**
 * Définition des middlewares de express
 */
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

/**
 * Utilisation des routes
 * (Utiliser : yarn build ou yarn tsoa:routes pour créer/mettre à jour le fichier)
 */
RegisterRoutes(app);

if (globals.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUI.serve, async (_req: Request, res: Response) => (
    res.send(swaggerUI.generateHTML(await import('../../docs/swagger.json')))
  ));
}

app.use(notFoundHandler());

app.use(errorHandler());

export default app;
