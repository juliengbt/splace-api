/* eslint-disable max-len */
import SoilType from './soil_type';
import EquipmentNature from './equipment_nature';
import EquipmentType from './equipment_type';
import { Installation } from './installation';
import EquipmentLevel from './equipment_level';
import { Sport } from './sport';
import Picture from './picture';
import Owner from './owner';

interface IEquipment {
  id: string;
  name: string;
  other_info: string | null;
  open_access: boolean | null;
  locker: boolean | null;
  lighting: boolean | null;
  shower: boolean | null;
  amount: number;
  longitude: number | null;
  latitude: number | null;
  owner: Owner | null | undefined;
  installation: Installation | null | undefined;
  soil_type: SoilType | null | undefined;
  equipment_nature: EquipmentNature | null | undefined;
  equipment_type: EquipmentType | null | undefined;
  equipment_level: EquipmentLevel | null | undefined;
  sports: Sport[] | undefined;
  pictures: Picture[] | undefined;
  rating: number | null | undefined;
  distance: number | undefined;
}

class Equipment {
  public static tName = 'Equipment';

  id: string;

  name: string;

  other_info: string | null;

  open_access: boolean | null;

  locker: boolean | null;

  lighting: boolean | null;

  shower: boolean | null;

  amount: number;

  longitude: number | null;

  latitude: number | null;

  installation: Installation | null | undefined;

  owner: Owner | null | undefined;

  soil_type: SoilType | null | undefined;

  equipment_nature: EquipmentNature | null | undefined;

  equipment_type: EquipmentType | null | undefined;

  equipment_level: EquipmentLevel | null | undefined;

  sports: Sport[] | undefined;

  pictures: Picture[] | undefined;

  rating: number | null | undefined;

  distance: number | undefined;

  constructor(id: string,
    name: string,
    other_info: string | null,
    open_access: boolean | null,
    locker: boolean | null,
    lighting: boolean | null,
    shower: boolean | null,
    amount: number,
    longitude: number | null,
    latitude: number | null,
    installation: Installation | null | undefined,
    owner: Owner | null | undefined,
    soil_type: SoilType | null | undefined,
    equipment_nature: EquipmentNature | null | undefined,
    equipment_type: EquipmentType | null | undefined,
    equipment_level: EquipmentLevel | null | undefined) {
    this.id = id;
    this.name = name;
    this.other_info = other_info;
    this.open_access = open_access;
    this.locker = locker;
    this.lighting = lighting;
    this.shower = shower;
    this.amount = amount;
    this.longitude = longitude;
    this.latitude = latitude;
    this.installation = installation;
    this.owner = owner;
    this.soil_type = soil_type;
    this.equipment_nature = equipment_nature;
    this.equipment_type = equipment_type;
    this.sports = undefined;
    this.pictures = undefined;
    this.rating = undefined;
    this.distance = undefined;
    this.equipment_level = equipment_level;
  }

  public static fromQuery(obj: any): Equipment | undefined {
    if (obj && this.tName in obj) {
      return new Equipment(
        obj[this.tName].id.toString('hex'),
        obj[this.tName].name,
        obj[this.tName].other_info,
        obj[this.tName].open_access === null ? null : Boolean(obj[this.tName].open_access.readUIntLE(0, 1)),
        obj[this.tName].locker === null ? null : Boolean(obj[this.tName].locker.readUIntLE(0, 1)),
        obj[this.tName].lighting === null ? null : Boolean(obj[this.tName].lighting.readUIntLE(0, 1)),
        obj[this.tName].shower === null ? null : Boolean(obj[this.tName].shower.readUIntLE(0, 1)),
        obj[this.tName].amount,
        obj[this.tName].longitude,
        obj[this.tName].latitude,
        obj[this.tName].id_installation === null ? null : Installation.fromQuery(obj),
        obj[this.tName].code_owner === null ? null : Owner.fromQuery(obj),
        obj[this.tName].code_soil_type === null ? null : SoilType.fromQuery(obj),
        obj[this.tName].code_equipment_nature === null ? null : EquipmentNature.fromQuery(obj),
        obj[this.tName].code_equipment_type === null ? null : EquipmentType.fromQuery(obj),
        obj[this.tName].code_equipment_level === null ? null : EquipmentLevel.fromQuery(obj),
      );
    }

    return undefined;
  }

  public setSports(sports: (Sport | undefined)[]): void {
    this.sports = sports.filter((s) => s instanceof Sport).map((s) => s as Sport);
  }

  public setPictures(pictures: (Picture | undefined)[]): void {
    this.pictures = pictures.filter((p) => p instanceof Picture).map((p) => p as Picture);
  }

  public setRating(rating: number | null): void {
    this.rating = rating;
  }

  public setDistance(distance: number): void {
    this.distance = distance;
  }
}

export { Equipment, IEquipment };
