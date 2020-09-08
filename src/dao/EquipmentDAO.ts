import DAO from './DAO';
import { Equipment } from '../models/equipment';
import { Sport } from '../models/sport';
import { Installation } from '../models/installation';
import Address from '../models/address';
import Department from '../models/department';
import City from '../models/city';
import SoilType from '../models/soil_type';
import Owner from '../models/owner';
import EquipmentType from '../models/equipment_type';
import EquipmentNature from '../models/equipment_nature';
import EquipmentLevel from '../models/equipment_level';
import Picture from '../models/picture';

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

  // TODO : getRating and getDistance
  public findById(id: string) : Promise<Equipment | undefined> {
    const query = this.db.from(Equipment.tName)
      .whereRaw(`${Equipment.tName}.id = UUID_TO_BIN(?)`, [id])
      .leftJoin(Installation.tName, `${Installation.tName}.id`, `${Equipment.tName}.id_installation`)
      .leftJoin(Address.tName, `${Address.tName}.id`, `${Installation.tName}.id_address`)
      .leftJoin(City.tName, `${City.tName}.id`, `${Installation.tName}.id_city`)
      .leftJoin(Department.tName, `${Department.tName}.id`, `${City.tName}.id_department`)
      .leftJoin(Owner.tName, `${Owner.tName}.code`, `${Equipment.tName}.code_owner`)
      .leftJoin(SoilType.tName, `${SoilType.tName}.code`, `${Equipment.tName}.code_soil_type`)
      .leftJoin(EquipmentType.tName, `${EquipmentType.tName}.code`, `${Equipment.tName}.code_equipment_type`)
      .leftJoin(EquipmentNature.tName, `${EquipmentNature.tName}.code`, `${Equipment.tName}.code_equipment_nature`)
      .leftJoin(EquipmentLevel.tName, `${EquipmentLevel.tName}.code`, `${Equipment.tName}.code_level`)
      .select()
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => Equipment.fromQuery(res[0]))
      .then((e) => (e instanceof Equipment
        ? this.getSports(e)
          .then((s) => e?.setSports(s))
          .then(() => e)
        : undefined))
      .then((e) => (e instanceof Equipment
        ? this.getPictures(e)
          .then((p) => e?.setPictures(p))
          .then(() => e)
        : undefined));
  }

  private getSports(equipment: Equipment): Promise<(Sport | undefined)[]> {
    const query = this.db.from('Equipment_Sport')
      .whereRaw('Equipment_Sport.id_equipment = UUID_TO_BIN(?)', [equipment.id])
      .innerJoin(Sport.tName, `${Sport.tName}.code`, 'Equipment_Sport.code_sport')
      .select(`${Sport.tName}.*`)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Sport.fromQuery(x)));
  }

  private getPictures(equipment: Equipment): Promise<(Picture | undefined)[]> {
    const query = this.db.from('Equipment_Picture')
      .whereRaw('Equipment_Picture.id_equipment = UUID_TO_BIN(?)', [equipment.id])
      .innerJoin(Picture.tName, `${Picture.tName}.id`, 'Equipment_Picture.id_picture')
      .select(`${Picture.tName}.*`)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Picture.fromQuery(x)));
  }
}
