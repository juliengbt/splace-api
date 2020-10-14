import { QueryBuilder } from 'knex';
import db from '../app/knexConf';
import { Equipment, IEquipment } from '../models/equipment';
import { Sport } from '../models/sport';
import { Installation } from '../models/installation';
import { Address } from '../models/address';
import { Department } from '../models/department';
import { City } from '../models/city';
import { SoilType } from '../models/soil_type';
import { Owner } from '../models/owner';
import { EquipmentType } from '../models/equipment_type';
import { EquipmentNature } from '../models/equipment_nature';
import { EquipmentLevel } from '../models/equipment_level';
import { Picture } from '../models/picture';

export default class EquipmentDAO {
  public static async all(): Promise<(Equipment)[]> {
    const query = EquipmentDAO.fullObjectQuery().limit(10).offset(10000);

    return query.then((res: any[]) => EquipmentDAO.linkPicturesSports(
      res.map((x: any) => Equipment.fromQuery(x))
        .filter((e) => e instanceof Equipment)
        .map((e) => e as Equipment),
    ));
  }

  public static async findById(id: string) : Promise<Equipment | undefined> {
    const query = EquipmentDAO.fullObjectQuery()
      .whereRaw(`${Equipment.tName}.id = UUID_TO_BIN(?)`, [id]);

    return query.then((res: any[]) => EquipmentDAO.linkPicturesSports(
      res.map((x: any) => Equipment.fromQuery(x))
        .filter((e) => e instanceof Equipment)
        .map((e) => e as Equipment),
    )[0]);
  }

  public static async distanceEquipment(equipment: IEquipment,
    offset: number) : Promise<Equipment[]> {
    const query = db.from(Equipment.tName)
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
      query.innerJoin('Equipment_Sport', 'Equipment_Sport.id_equipment', `${Equipment.tName}.id`)
        .innerJoin(Sport.tName, `${Sport.tName}.code`, 'Equipment_Sport.code_sport')
        .whereIn('Equipment_Sport.code_sport', equipment.sports.map((s) => s.code).filter((s) => s).map((s) => s as string));
    }

    if (equipment.latitude && equipment.longitude) {
      query.whereNotNull(`${Equipment.tName}.latitude`)
        .whereNotNull(`${Equipment.tName}.longitude`)
        .select(db.raw(`get_distance(?,?,${Equipment.tName}.latitude, ${Equipment.tName}.longitude) as distance`, [EquipmentDAO.degToRad(equipment.latitude), EquipmentDAO.degToRad(equipment.longitude)]))
        .orderBy('distance', 'asc');

      if (equipment.distance) {
        query.having('distance', '<=', equipment.distance);
      }
    }

    if (equipment.open_access !== undefined) query.andWhere(`${Equipment.tName}.open_access`, equipment.open_access);
    if (equipment.lighting !== undefined) query.andWhere(`${Equipment.tName}.lighting`, equipment.lighting);
    if (equipment.locker !== undefined) query.andWhere(`${Equipment.tName}.locker`, equipment.locker);
    if (equipment.shower !== undefined) query.andWhere(`${Equipment.tName}.shower`, equipment.shower);
    if (equipment.installation?.car_park !== undefined) query.andWhere(`${Installation.tName}.car_park`, equipment.installation.car_park);
    if (equipment.installation?.disabled_access !== undefined) query.andWhere(`${Installation.tName}.disabled_access`, equipment.installation.disabled_access);

    if (Array.isArray(equipment.soil_type) && equipment.soil_type.length > 0) { query.whereIn(`${SoilType.tName}.code`, equipment.soil_type.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (Array.isArray(equipment.owner) && equipment.owner.length > 0) { query.whereIn(`${Owner.tName}.code`, equipment.owner.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (Array.isArray(equipment.equipment_level) && equipment.equipment_level.length > 0) { query.whereIn(`${EquipmentLevel.tName}.code`, equipment.equipment_level.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (Array.isArray(equipment.equipment_nature) && equipment.equipment_nature.length > 0) { query.whereIn(`${EquipmentNature.tName}.code`, equipment.equipment_nature.filter((s) => s.code !== undefined).map((s) => s.code as string)); }
    if (Array.isArray(equipment.equipment_type) && equipment.equipment_type.length > 0) { query.whereIn(`${EquipmentType.tName}.code`, equipment.equipment_type.filter((s) => s.code !== undefined).map((s) => s.code as string)); }

    if (equipment.name || equipment.installation?.name) {
      if (equipment.name && equipment.installation?.name) {
        query.andWhere((builder: QueryBuilder) => {
          builder.whereRaw(`lower(${Installation.tName}.name) like ?`, `%${equipment.installation?.name?.toLowerCase()}%`)
            .orWhereRaw(`lower(${Equipment.tName}.name) like ?`, `%${equipment.name?.toLowerCase()}%`);
        });
      } else if (equipment.name) {
        query.andWhereRaw(`lower(${Equipment.tName}.name) like ?`, `%${equipment.name?.toLowerCase()}%`);
      } else {
        query.andWhereRaw(`lower(${Installation.tName}.name) like ?`, `%${equipment.installation?.name?.toLowerCase()}%`);
      }
    }

    return query.then((res: any[]) => res.map((e) => Equipment.fromQuery(e))
      .filter((e) => e instanceof Equipment)
      .map((e) => e as Equipment));
  }

  private static degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private static linkPicturesSports(orignial_list: Equipment[]): Equipment[] {
    return Object.values(orignial_list.reduce((obj : any, equip : Equipment) => {
      if (obj[equip.id]) {
        // eslint-disable-next-line no-param-reassign
        obj[equip.id].sports = [...obj[equip.id].sports, ...equip.sports];
        // eslint-disable-next-line no-param-reassign
        obj[equip.id].pictures = [...obj[equip.id].pictures, ...equip.pictures];
      } else {
        // eslint-disable-next-line no-param-reassign
        obj[equip.id] = equip;
      }
      return obj;
    }, {}));
  }

  /*
  private static getSports(equipment: Equipment): Promise<(Sport | undefined)[]> {
    const query = db.from('Equipment_Sport')
      .whereRaw('Equipment_Sport.id_equipment = UUID_TO_BIN(?)', [equipment.id])
      .innerJoin(Sport.tName, `${Sport.tName}.code`, 'Equipment_Sport.code_sport')
      .select(`${Sport.tName}.*`)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res) => res.map((x) => Sport.fromQuery(x)));
  }

  private static getPictures(equipment: Equipment): Promise<(Picture | undefined)[]> {
    const query = db.from('Equipment_Picture')
      .whereRaw('Equipment_Picture.id_equipment = UUID_TO_BIN(?)', [equipment.id])
      .innerJoin(Picture.tName, `${Picture.tName}.id`, 'Equipment_Picture.id_picture')
      .select(`${Picture.tName}.*`)
      .options({ nestTables: true, rowMode: 'array' });

    return query.then((res: any) => res.map((x: any) => Picture.fromQuery(x)));
  }
*/
  private static fullObjectQuery(): QueryBuilder<Equipment> {
    return db.from<Equipment>(Equipment.tName)
      .leftJoin(Installation.tName, `${Installation.tName}.id`, `${Equipment.tName}.id_installation`)
      .leftJoin(Address.tName, `${Address.tName}.id`, `${Installation.tName}.id_address`)
      .leftJoin(City.tName, `${City.tName}.id`, `${Installation.tName}.id_city`)
      .leftJoin(Department.tName, `${Department.tName}.id`, `${City.tName}.id_department`)
      .leftJoin(Owner.tName, `${Owner.tName}.code`, `${Equipment.tName}.code_owner`)
      .leftJoin(SoilType.tName, `${SoilType.tName}.code`, `${Equipment.tName}.code_soil_type`)
      .leftJoin(EquipmentType.tName, `${EquipmentType.tName}.code`, `${Equipment.tName}.code_equipment_type`)
      .leftJoin(EquipmentNature.tName, `${EquipmentNature.tName}.code`, `${Equipment.tName}.code_equipment_nature`)
      .leftJoin(EquipmentLevel.tName, `${EquipmentLevel.tName}.code`, `${Equipment.tName}.code_level`)
      .innerJoin(Equipment.SportJoinTable, `${Equipment.PictureJoinTable}.id_equipment`, `${Equipment.tName}.id`)
      .innerJoin(Sport.tName, `${Sport.tName}.id`, `${Equipment.PictureJoinTable}.code_sport`)
      .innerJoin(Equipment.PictureJoinTable, `${Equipment.PictureJoinTable}.id_equipment`, `${Equipment.tName}.id`)
      .innerJoin(Picture.tName, `${Picture.tName}.id`, `${Equipment.PictureJoinTable}.id_picture`)
      .options({ nestTables: true, rowMode: 'array' });
  }
}
