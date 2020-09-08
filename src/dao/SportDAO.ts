import DAO from './DAO';
import { Sport } from '../models/sport';
import Category from '../models/category';

export default class SportDAO extends DAO {
  public all(category: string | undefined, lazy: boolean): Promise<(Sport | undefined)[]> {
    const query = this.db.from(Sport.tName)
      .options({ nestTables: true, rowMode: 'array' });

    if (!lazy) {
      query.innerJoin(Category.tName, `${Category.tName}.code`, `${Sport.tName}.code_category`);
    }
    if (category) {
      query.where(`${Sport.tName}.code_category`, category);
    }

    return query.then((res) => res.map((x) => Sport.fromQuery(x)));
  }

  public findByCode(code: string, lazy: boolean): Promise<Sport | undefined> {
    const query = this.db.from(Sport.tName)
      .where(`${Sport.tName}.code`, code)
      .options({ nestTables: true, rowMode: 'array' });

    if (!lazy) {
      query.innerJoin(Category.tName, `${Category.tName}.code`, `${Sport.tName}.code_category`);
    }

    return query.then((res) => Sport.fromQuery(res[0]));
  }

  public findByCodes(codes: string[]): Promise<(Sport | undefined)[]> {
    const query = this.db.from(Sport.tName)
      .whereIn(`${Sport.tName}.code`, codes)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Sport.fromQuery(x)));
  }
}
