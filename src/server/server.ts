import express, { Router, Application } from "express";
import Knex from "knex";
import { attachOnDuplicateUpdate } from "knex-on-duplicate-update"
import SportController from "../controllers/SportController";

export default class Server {

    public router: Router;
    public app: Application;
    public db: Knex;

    private sportController!: SportController;
    private port: string;

    constructor() {
        this.app = express();
        this.router = express.Router();
        this.port = process.env.PORT || '3000';
        this.db = this.getDB();
        attachOnDuplicateUpdate();
    }

    public getDB(): Knex {
        return Knex({
            client: 'mysql2',
            version: '8.0',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            },
            pool: { min: 2, max: 10 }
        });
    }

    public start(): void {
        this.db.select(1)
            .then(() => console.log('Connected to database'))
            .then(() => this.initControllers())
            .then(() => this.listen())
            .catch((err) => console.log(err));
    }

    private listen(): void {
        this.app.listen(this.port, () => console.log(`Listenning on port : ${this.port}`));
    }

    private initControllers(): void {
        this.sportController = new SportController(this);
        this.app.use(this.router);
    }
}