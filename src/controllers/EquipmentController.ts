import { Request, Response, Router } from 'express';
import Knex from 'knex';
import Controller from './Controller';
import EquipmentDAO from '../dao/EquipmentDAO';
import IEquipment from '../splace-interfaces/equipment';

export default class EquipmentController extends Controller {
  public equipmentDao: EquipmentDAO;

  constructor(router: Router, db: Knex) {
    super(router);
    this.equipmentDao = new EquipmentDAO(db);
  }

  protected initRoutes() {
    this.router.get('/equipment/:id', (req: Request, res: Response, next: Function) => this.getEquipment(req, res, next));
    this.router.put('/equipment', (req: Request, res: Response, next: Function) => this.getEquipments(req, res, next));
  }

  public getEquipment(req: Request, res: Response, next: Function): void {
    this.equipmentDao.findById(req.params.id)
      .then((sports) => res.status(200).json(sports))
      .catch((err: any) => { res.status(400); next(err); });
  }

  // TODO : Equipement par distance

  public getEquipments(req: Request, res: Response, next: Function): void {
    const offset = typeof req.body.offset === 'number' ? req.body.offset : 0;

    this.equipmentDao.distanceEquipment(req.body as IEquipment, offset)
      .then((eqps) => res.status(200).json(eqps))
      .catch((err: any) => { res.status(400); next(err); });
  }
}
