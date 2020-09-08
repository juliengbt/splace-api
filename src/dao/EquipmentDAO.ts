import DAO from './DAO';
import { Equipment } from '../models/equipment';
import Sport from '../models/sport';

export default class EquipmentDAO extends DAO {
  public all(): Promise<(Equipment | null)[]> {
    const query = this.db.from(Equipment.tName).limit(10).offset(10000)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Equipment.fromQuery(x)))
      .then((equips) => Promise.all(equips
        .filter((e) => e instanceof Equipment)
        .map((e) => e as Equipment)
        .map((e) => this.getSports(e)
          .then((sp) => { e.setSports(sp); })
          .then(() => e))));
  }

  private getSports(equipment: Equipment): Promise<(Sport | undefined)[]> {
    const query = this.db.from('Equipment_Sport')
      .whereRaw('Equipment_Sport.id_equipment = UUID_TO_BIN(?)', [equipment.id])
      .innerJoin(Sport.tName, `${Sport.tName}.code`, 'Equipment_Sport.code_sport')
      .select(`${Sport.tName}.*`)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Sport.fromQuery(x)));
  }
}
