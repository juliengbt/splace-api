/* eslint-disable max-len */
import SoilType from './soil_type';
import EquipmentNature from './equipment_nature';
import EquipmentType from './equipment_type';
import Installation from './installation';
import EquipmentLevel from './equipment_level';
import Sport from './sport';
import Picture from './picture';
import Owner from './owner';

export default class Equipment {
  public static tName = 'Equipment';

  public static PictureJoinTable = 'Equipment_Picture';

  public static SportJoinTable = 'Equipment_Sport';

  id!: string;

  name!: string;

  other_info: string | null;

  open_access: boolean | null;

  locker: boolean | null;

  lighting: boolean | null;

  shower: boolean | null;

  amount: number;

  longitude: number | null;

  latitude: number | null;

  installation?: Installation | null;

  owner?: Owner | null;

  soil_type?: SoilType | null;

  equipment_nature?: EquipmentNature | null;

  equipment_type?: EquipmentType | null;

  equipment_level?: EquipmentLevel | null;

  sports: Sport[];

  pictures: Picture[];

  rating?: number | null;

  distance?: number;

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
    sports: Sport[],
    pictures: Picture[],
    installation?: Installation | null,
    owner?: Owner | null,
    soil_type?: SoilType | null,
    equipment_nature?: EquipmentNature | null,
    equipment_type?: EquipmentType | null,
    equipment_level?: EquipmentLevel | null,
    distance?: number) {
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
    this.equipment_level = equipment_level;
    this.sports = sports;
    this.pictures = pictures;
    this.rating = undefined;
    this.distance = distance;
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
        [Sport.fromQuery(obj)].filter((s) => s !== undefined).map((s) => s as Sport),
        [Picture.fromQuery(obj)].filter((p) => p !== undefined).map((p) => p as Picture),
        obj[this.tName].id_installation === null ? null : Installation.fromQuery(obj),
        obj[this.tName].code_owner === null ? null : Owner.fromQuery(obj),
        obj[this.tName].code_soil_type === null ? null : SoilType.fromQuery(obj),
        obj[this.tName].code_equipment_nature === null ? null : EquipmentNature.fromQuery(obj),
        obj[this.tName].code_equipment_type === null ? null : EquipmentType.fromQuery(obj),
        obj[this.tName].code_equipment_level === null ? null : EquipmentLevel.fromQuery(obj),
        obj[''] !== undefined ? obj[''].distance : undefined,
      );
    }

    return undefined;
  }
}
