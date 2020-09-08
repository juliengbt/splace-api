import Department from '../models/department';
import DAO from './DAO';

export default class DepartmentDAO extends DAO {
  public all(): Promise<(Department | undefined)[]> {
    const query = this.db.from(Department.tName)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Department.fromQuery(x)));
  }
}
