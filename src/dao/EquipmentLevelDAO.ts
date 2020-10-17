import { QueryBuilder } from 'knex';
import db from '../app/knexConf';
import { EquipmentLevel } from '../models/equipment_level';

export default class EquipmentLevelDAO {
  public static async all(): Promise<EquipmentLevel[]> {
    return EquipmentLevelDAO.fullObjectQuery()
      .then((res: any[]) => res.map((o) => EquipmentLevel.fromQuery(o))
        .filter((o) => o !== undefined)
        .map((o) => o as EquipmentLevel));
  }

  public static fullObjectQuery(): QueryBuilder<EquipmentLevel> {
    return db.from<EquipmentLevel>(EquipmentLevel.tName)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
