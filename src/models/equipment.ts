import SoilType from "./soil_type";
import EquipmentNature from "./equipment_nature";
import EquipmentType from "./equipment_type";
import { Installation } from "./installation";
import EquipmentLevel from "./equipment_level";
import Sport from "./sport";
import Picture from "./picture";

interface _Equipment {
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

    constructor(id: string,
        name: string,
        other_info: string,
        open_access: boolean,
        locker: boolean,
        lighting: boolean,
        shower: boolean,
        amount: number,
        longitude: number,
        latitude: number,
        installation: Installation | null,
        soil_type: SoilType | null,
        equipment_nature: EquipmentNature | null,
        equipment_type: EquipmentType | null,
        equipment_level: EquipmentLevel | null,
        sports: Sport[] | null,
        pictures: Picture[] | null,
        rating: number | null,
        distance: number | null) {
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
        this.sports = sports;
        this.pictures = pictures;
        this.rating = rating;
        this.distance = distance;
        this.equipment_level = equipment_level;
    }
    //TODO : Liste des sports
    public static fromJSON(obj: any): Equipment | null {

        if (obj && this.tName in obj) {
            return new Equipment(
                obj[this.tName]['id'].toString('hex'),
                obj[this.tName]['name'],
                obj[this.tName]['other_info'],
                Boolean(obj[this.tName]['open_access']["data"][0]),
                Boolean(obj[this.tName]['locker']["data"][0]),
                Boolean(obj[this.tName]['lighting']["data"][0]),
                Boolean(obj[this.tName]['shower']["data"][0]),
                obj[this.tName]['amount'],
                obj[this.tName]['longitude'],
                obj[this.tName]['latitude'],
                Installation.fromJSON(obj),
                SoilType.fromJSON(obj),
                EquipmentNature.fromJSON(obj),
                EquipmentType.fromJSON(obj),
                EquipmentLevel.fromJSON(obj),
            )
        }

        return null;
    }
}

export { Equipment, _Equipment }