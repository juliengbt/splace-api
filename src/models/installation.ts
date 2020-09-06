import Address from "./address";
import City from "./city";

interface _Installation {
    id: string;
    name: string;
    car_park: boolean;
    disabled_access: boolean;
    address: Address | null;
    city: City | null;
}

class Installation {
    public static tName = 'Installation';

    public id: string;
    public name: string;
    public car_park: boolean;
    public disabled_access: boolean;
    public address: Address | null;
    public city: City | null;

    constructor(id: string, name: string, car_park: boolean, disabled_access: boolean, address: Address | null, city: City | null) {
        this.id = id;
        this.name = name;
        this.car_park = car_park;
        this.disabled_access = disabled_access;
        this.address = address;
        this.city = city;
    }

    public static fromJSON(obj: any): Installation | null {

        if (obj && this.tName in obj) {
            return new Installation(obj[this.tName]['id'].toString('hex'),
                obj[this.tName]['name'],
                obj[this.tName]['car_park'],
                obj[this.tName]['disabled_access'],
                Address.fromJSON(obj),
                City.fromJSON(obj)
            );
        }

        return null;
    }
}

export { Installation, _Installation };