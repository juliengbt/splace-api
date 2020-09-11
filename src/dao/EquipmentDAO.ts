import { isArray } from 'util';
import DAO from './DAO';
import Equipment from '../models/equipment';
import Sport from '../models/sport';
import Installation from '../models/installation';
import Address from '../models/address';
import Department from '../models/department';
import City from '../models/city';
import SoilType from '../models/soil_type';
import Owner from '../models/owner';
import EquipmentType from '../models/equipment_type';
import EquipmentNature from '../models/equipment_nature';
import EquipmentLevel from '../models/equipment_level';
import Picture from '../models/picture';
import IEquipment from '../splace-interfaces/equipment';

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

  public distanceEquipment(equipment: IEquipment, offset: number) : Promise<Equipment[]> {
    const query = this.db.from(Equipment.tName)
      .leftJoin(Installation.tName, `${Installation.tName}.id`, `${Equipment.tName}.id_installation`)
      .leftJoin(Address.tName, `${Address.tName}.id`, `${Installation.tName}.id_address`)
      .leftJoin(City.tName, `${City.tName}.id`, `${Installation.tName}.id_city`)
      .leftJoin(Department.tName, `${Department.tName}.id`, `${City.tName}.id_department`)
      .leftJoin(Owner.tName, `${Owner.tName}.code`, `${Equipment.tName}.code_owner`)
      .leftJoin(SoilType.tName, `${SoilType.tName}.code`, `${Equipment.tName}.code_soil_type`)
      .leftJoin(EquipmentType.tName, `${EquipmentType.tName}.code`, `${Equipment.tName}.code_equipment_type`)
      .leftJoin(EquipmentNature.tName, `${EquipmentNature.tName}.code`, `${Equipment.tName}.code_equipment_nature`)
      .leftJoin(EquipmentLevel.tName, `${EquipmentLevel.tName}.code`, `${Equipment.tName}.code_level`)
      .select('*')
      .limit(25)
      .offset(offset)
      .options({ nestTables: true, rowMode: 'array' });

    if (equipment.sports && equipment.sports.length > 0) {
      query.leftJoin('Equipment_Sport', 'Equipment_Sport.id_equipment', `${Equipment.tName}.id`)
        .whereIn('Equipment_Sport.code_sport', equipment.sports?.filter((s) => s.code !== undefined).map((s) => s.code as string));
    }

    if (equipment.latitude && equipment.longitude) {
      query.whereNotNull(`${Equipment.tName}.latitude`)
        .whereNotNull(`${Equipment.tName}.longitude`)
        .select(this.db.raw(`get_distance(?,?,${Equipment.tName}.latitude, ${Equipment.tName}.longitude) as distance`, [EquipmentDAO.degToRad(equipment.latitude), EquipmentDAO.degToRad(equipment.longitude)]))
        .orderBy('distance', 'asc');

      if (equipment.distance) {
        query.having('distance', '<=', equipment.distance as number);
      }
    }

    if (equipment.open_access !== undefined) query.where(`${Equipment.tName}.open_access`, equipment.open_access);
    if (equipment.lighting !== undefined) query.where(`${Equipment.tName}.lighting`, equipment.lighting);
    if (equipment.locker !== undefined) query.where(`${Equipment.tName}.locker`, equipment.locker);
    if (equipment.shower !== undefined) query.where(`${Equipment.tName}.shower`, equipment.shower);
    if (equipment.installation?.car_park !== undefined) query.where(`${Installation.tName}.car_park`, equipment.installation.car_park);
    if (equipment.installation?.disabled_access !== undefined) query.where(`${Installation.tName}.disabled_access`, equipment.installation.disabled_access);

    if (isArray(equipment.soil_type) && equipment.soil_type.length > 0) { query.whereIn(`${SoilType.tName}.code`, equipment.soil_type.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (isArray(equipment.owner) && equipment.owner.length > 0) { query.whereIn(`${Owner.tName}.code`, equipment.owner.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (isArray(equipment.equipment_level) && equipment.equipment_level.length > 0) { query.whereIn(`${EquipmentLevel.tName}.code`, equipment.equipment_level.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (isArray(equipment.equipment_nature) && equipment.equipment_nature.length > 0) { query.whereIn(`${EquipmentNature.tName}.code`, equipment.equipment_nature.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (isArray(equipment.equipment_type) && equipment.equipment_type.length > 0) { query.whereIn(`${EquipmentType.tName}.code`, equipment.equipment_type.filter((s) => s.code !== undefined).map((s) => s.code as string)); }

    return query.then((res) => res.map((e) => Equipment.fromQuery(e)))
      .then((res) => res.filter((e) => e instanceof Equipment))
      .then((res) => res.map((e) => e as Equipment));
  }

  private static degToRad(deg: number): number {
    return deg * (Math.PI / 180);
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
