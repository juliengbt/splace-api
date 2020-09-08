import { Request, Response, Router } from 'express';
import Knex from 'knex';
import SportDAO from '../dao/SportDAO';
import Controller from './Controller';

export default class SportController extends Controller {
  public sportDao: SportDAO;

  constructor(router: Router, db: Knex) {
    super(router);
    this.sportDao = new SportDAO(db);
  }

  protected initRoutes() {
    this.router.get('/sport', (req: Request, res: Response, next: Function) => this.getSports(req, res, next));
    this.router.get('/sport/:code', (req: Request, res: Response, next: Function) => this.getSport(req, res, next));
  }

  public getSports(req: Request, res: Response, next: Function): void {
    let category: string | undefined;
    if (typeof req.query.category === 'string') {
      category = req.query.category;
    }
    this.sportDao.all(category, req.query.lazy !== 'false')
      .then((sports) => Promise.resolve(res.status(200).json(sports)))
      .catch((err) => { res.status(400); next(err); });
  }

  public getSport(req: Request, res: Response, next: Function): void {
    this.sportDao.findByCode(req.params.code, req.query.lazy !== 'false')
      .then((sport) => { Promise.resolve(res.status(200).json(sport)); })
      .catch((err) => { res.status(400); next(err); });
  }
}
