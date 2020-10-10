import Address from './address';
import City from './city';

export default class Installation {
  public static tName = 'Installation';

  public id: string;

  public name: string;

  public car_park: boolean | null;

  public disabled_access: boolean | null;

  public address?: Address | null;

  public city?: City | null;

  // eslint-disable-next-line max-len
  constructor(id: string, name: string, car_park: boolean | null, disabled_access: boolean | null, address?: Address | null, city?: City | null) {
    this.id = id;
    this.name = name;
    this.car_park = car_park;
    this.disabled_access = disabled_access;
    this.address = address;
    this.city = city;
  }

  public static fromQuery(obj: any): Installation | undefined {
    if (obj && this.tName in obj) {
      return new Installation(obj[this.tName].id.toString('hex'),
        obj[this.tName].name,
        obj[this.tName].car_park === null ? null : Boolean(obj[this.tName].car_park),
        obj[this.tName].disabled_access === null ? null : Boolean(obj[this.tName].disabled_access),
        obj[this.tName].id_address === null ? null : Address.fromQuery(obj),
        obj[this.tName].id_city === null ? null : City.fromQuery(obj));
    }

    return undefined;
  }
}
