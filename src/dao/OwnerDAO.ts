import { QueryBuilder } from 'knex';
import db from '../app/knexConf';
import { Owner } from '../models/owner';

export default class OwnerDAO {
  public static async all(): Promise<Owner[]> {
    return OwnerDAO.fullObjectQuery()
      .then((res: any[]) => res.map((o) => Owner.fromQuery(o))
        .filter((o) => o !== undefined)
        .map((o) => o as Owner));
  }

  public static fullObjectQuery(): QueryBuilder<Owner> {
    return db.from<Owner>(Owner.tName)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
