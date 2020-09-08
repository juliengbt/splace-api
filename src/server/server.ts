import express, { Router, Application } from 'express';
import Knex from 'knex';
import { attachOnDuplicateUpdate } from 'knex-on-duplicate-update';
import SportController from '../controllers/SportController';
import DepartmentController from '../controllers/DepartmentController';
import EquipmentController from '../controllers/EquipmentController';
import logger from './logger';

export default class Server {
  public router: Router;

  public app: Application;

  public db: Knex;

  private sportController!: SportController;

  private departmentController!: DepartmentController;

  private equipmentController!: EquipmentController;

  private port: string;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.port = process.env.PORT || '3000';
    this.db = Server.getDB();
    attachOnDuplicateUpdate();
  }

  private static getDB(): Knex {
    return Knex({
      client: 'mysql2',
      version: '8.0',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      },
      pool: { min: 2, max: 10 },
    });
  }

  public start(): void {
    this.db.select(1)
      .then(() => logger.info('Connected to database'))
      .then(() => this.initControllers())
      .then(() => this.listen())
      .catch((err) => logger.error(err));
  }

  private listen(): void {
    this.app.listen(this.port, () => logger.info(`Listenning on port : ${this.port}`));
  }

  private initControllers(): void {
    this.sportController = new SportController(this.router, this.db);
    this.departmentController = new DepartmentController(this.router, this.db);
    this.equipmentController = new EquipmentController(this.router, this.db);
    this.app.use(this.router);
  }
}
