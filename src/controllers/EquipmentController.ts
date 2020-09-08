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
    this.router.get('/equipment/:id', (req: Request, res: Response, next: Function) => this.getEquipment(req, res, next));
    // eslint-disable-next-line max-len
    // this.router.put('/equipment', (req: Request, res: Response, next: Function) => this.getEquipments(req, res, next));
  }

  public getEquipment(req: Request, res: Response, next: Function): void {
    this.equipmentDao.findById(req.params.id)
      .then((sports) => res.status(200).json(sports))
      .catch((err: any) => { res.status(400); next(err); });
  }

  // TODO : Equipement par distance
  /*
  public static getEquipments(req: Request, res: Response, next: Function): void {

    Promise.resolve(res.status(200))
      .catch((err: any) => { res.status(400); next(err); });
  }
  */
}
