import { QueryBuilder } from 'knex';
import db from '../app/knexConf';
import { EquipmentNature } from '../models/equipment_nature';

export default class EquipmentNatureDAO {
  public static async all(): Promise<EquipmentNature[]> {
    return EquipmentNatureDAO.fullObjectQuery()
      .then((res: any[]) => res.map((o) => EquipmentNature.fromQuery(o))
        .filter((o) => o !== undefined)
        .map((o) => o as EquipmentNature));
  }

  public static fullObjectQuery(): QueryBuilder<EquipmentNature> {
    return db.from<EquipmentNature>(EquipmentNature.tName)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
