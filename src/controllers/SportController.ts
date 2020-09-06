import { Request, Response } from "express";
import SportDAO from "../dao/SportDAO";
import Server from "../server/server";

export default class SportController {

    public server: Server;
    public sportDao: SportDAO;

    constructor(server: Server) {
        this.server = server;
        this.sportDao = new SportDAO(server.db);
        this.initRoutes();
    }

    private initRoutes() {
        this.server.router.get('/sport', (req: Request, res: Response, next: Function) => this.getSports(req, res, next));
        this.server.router.get('/sport/:code', (req: Request, res: Response, next: Function) => this.getSport(req, res, next));
    }

    public getSports(req: Request, res: Response, next: Function): void {
        let category: string | undefined = undefined;
        if (typeof req.query.category === "string") {
            category = req.query.category;
        }
        this.sportDao.all(category, req.query.lazy !== "false")
            .then(sports => Promise.resolve(res.status(200).json(sports)))
            .catch((err) => { res.status(400); next(err) });
    }

    public getSport(req: Request, res: Response, next: Function): void {
        this.sportDao.findByCode(req.params.code, req.query.lazy !== "false")
            .then(sport => { Promise.resolve(res.status(200).json(sport)); })
            .catch((err) => { res.status(400); next(err) });
    }
}