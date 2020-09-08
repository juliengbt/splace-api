import { Request, Response, Router } from 'express';
import Knex from 'knex';
import Controller from './Controller';
import DepartmentDAO from '../dao/DepartmentDAO';

export default class DepartmentController extends Controller {
  public departmentDao: DepartmentDAO;

  constructor(router: Router, db: Knex) {
    super(router);
    this.departmentDao = new DepartmentDAO(db);
  }

  protected initRoutes() {
    this.router.get('/department', (req: Request, res: Response, next: Function) => this.getDepartments(req, res, next));
  }

  public getDepartments(req: Request, res: Response, next: Function): void {
    this.departmentDao.all()
      .then((deps) => Promise.resolve(res.status(200).json(deps)))
      .catch((err) => { res.status(400); next(err); });
  }
}
