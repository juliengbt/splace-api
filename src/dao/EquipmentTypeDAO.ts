import { QueryBuilder } from 'knex';
import db from '../app/knexConf';
import { EquipmentType } from '../models/equipment_type';

export default class EquipmentTypeDAO {
  public static async all(): Promise<EquipmentType[]> {
    return EquipmentTypeDAO.fullObjectQuery()
      .then((res: any[]) => res.map((o) => EquipmentType.fromQuery(o))
        .filter((o) => o !== undefined)
        .map((o) => o as EquipmentType));
  }

  public static fullObjectQuery(): QueryBuilder<EquipmentType> {
    return db.from<EquipmentType>(EquipmentType.tName)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
