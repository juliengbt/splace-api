import { QueryBuilder } from 'knex';
import { Sport } from '../models/sport';
import { Category } from '../models/category';
import db from '../app/knexConf';

export default class SportDAO {
  public static all(category?: string): Promise<Sport[]> {
    const query = SportDAO.fullObjectQuery();

    if (category) {
      query.where(`${Sport.tName}.code_category`, category);
    }

    return query.then(((res: any[]) => res.map((s: any) => Sport.fromQuery(s))
      .filter((s: any) => s)
      .map((s: any) => s as Sport)
    ));
  }

  public static findByCode(code: string): Promise<Sport | undefined> {
    const query = SportDAO.fullObjectQuery()
      .where(`${Sport.tName}.code`, code);

    return query.then((res: any) => Sport.fromQuery(res[0]));
  }

  public findByCodes(codes: string[]): Promise<(Sport)[]> {
    const query = SportDAO.fullObjectQuery()
      .whereIn(`${Sport.tName}.code`, codes);

    return query.then((res: any) => res.map((x: any) => Sport.fromQuery(x))
      .filter((s: any) => s !== undefined)
      .map((s: any) => s as Sport));
  }

  public static fullObjectQuery(): QueryBuilder<Sport> {
    return db.from<Sport>(Sport.tName)
      .innerJoin(Category.tName, `${Category.tName}.code`, `${Sport.tName}.code_category`)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
