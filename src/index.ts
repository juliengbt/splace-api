import app from './app/app';
import { globals } from './app/globals';
import log from './app/logger';

const port = globals.SERVER.PORT;

app.listen(port, () => {
  log.info(`Lancement du serveur réussi au port ${port}.`);
});
