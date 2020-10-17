import { QueryBuilder } from 'knex';
import db from '../app/knexConf';
import { SoilType } from '../models/soil_type';

export default class SoilTypeDAO {
  public static async all(): Promise<SoilType[]> {
    return SoilTypeDAO.fullObjectQuery()
      .then((res: any[]) => res.map((o) => SoilType.fromQuery(o))
        .filter((o) => o !== undefined)
        .map((o) => o as SoilType));
  }

  public static fullObjectQuery(): QueryBuilder<SoilType> {
    return db.from<SoilType>(SoilType.tName)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
