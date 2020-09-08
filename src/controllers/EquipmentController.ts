import { Request, Response, Router } from 'express';
import Knex from 'knex';
import Controller from './Controller';
import EquipmentDAO from '../dao/EquipmentDAO';

export default class EquipmentController extends Controller {
  public equipmentDao: EquipmentDAO;

  constructor(router: Router, db: Knex) {
    super(router);
    this.equipmentDao = new EquipmentDAO(db);
  }

  protected initRoutes() {
    this.router.get('/equipment', (req: Request, res: Response, next: Function) => this.getEquipments(req, res, next));
  }

  public getEquipments(req: Request, res: Response, next: Function): void {
    this.equipmentDao.all()
      .then((sports) => Promise.resolve(res.status(200).json(sports)))
      .catch((err: any) => { res.status(400); next(err); });
  }
}
