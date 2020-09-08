/* eslint-disable max-len */
import SoilType from './soil_type';
import EquipmentNature from './equipment_nature';
import EquipmentType from './equipment_type';
import { Installation } from './installation';
import EquipmentLevel from './equipment_level';
import Sport from './sport';
import Picture from './picture';

interface IEquipment {
  id: string;
  name: string;
  other_info: string;
  open_access: boolean;
  locker: boolean;
  lighting: boolean;
  shower: boolean;
  amount: number;
  longitude: number;
  latitude: number;
  installation: Installation | null;
  soil_type: SoilType | null;
  equipment_nature: EquipmentNature | null;
  equipment_type: EquipmentType | null;
  equipment_level: EquipmentLevel | null;
  sports: Sport[] | null;
  pictures: Picture[] | null;
  rating: number | null;
  distance: number | null;
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

  longitude: number;

  latitude: number;

  installation: Installation | null;

  soil_type: SoilType | null;

  equipment_nature: EquipmentNature | null;

  equipment_type: EquipmentType | null;

  equipment_level: EquipmentLevel | null;

  sports: Sport[];

  pictures: Picture[];

  rating: number | null;

  distance: number | null;

  constructor(id: string,
    name: string,
    other_info: string | null,
    open_access: boolean | null,
    locker: boolean | null,
    lighting: boolean | null,
    shower: boolean | null,
    amount: number,
    longitude: number,
    latitude: number,
    installation: Installation | null,
    soil_type: SoilType | null,
    equipment_nature: EquipmentNature | null,
    equipment_type: EquipmentType | null,
    equipment_level: EquipmentLevel | null) {
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
    this.soil_type = soil_type;
    this.equipment_nature = equipment_nature;
    this.equipment_type = equipment_type;
    this.sports = [];
    this.pictures = [];
    this.rating = null;
    this.distance = null;
    this.equipment_level = equipment_level;
  }

  public static fromQuery(obj: any): Equipment | null {
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
        Installation.fromQuery(obj),
        SoilType.fromQuery(obj),
        EquipmentNature.fromQuery(obj),
        EquipmentType.fromQuery(obj),
        EquipmentLevel.fromQuery(obj),
      );
    }

    return null;
  }

  public setSports(sports: (Sport | undefined)[]): void {
    this.sports = sports.filter((s) => s instanceof Sport).map((s) => s as Sport);
  }

  public setPictures(pictures: Picture[] | undefined): void {
    this.pictures = pictures || [];
  }

  public setRating(rating: number): void {
    this.rating = rating;
  }

  public setDistance(distance: number): void {
    this.distance = distance;
  }
}

export { Equipment, IEquipment };
