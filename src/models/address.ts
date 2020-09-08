export default class Address {
  public static tName = 'Address';

  id: string;

  street_num: string;

  street_name: string;

  locality: string;

  district: number;

  // eslint-disable-next-line max-len
  constructor(id: string, street_num: string, street_name: string, locality: string, district: number) {
    this.id = id;
    this.street_num = street_num;
    this.street_name = street_name;
    this.locality = locality;
    this.district = district;
  }

  public static fromQuery(obj: any): Address | null {
    if (obj && this.tName in obj) {
      return new Address(
        obj[this.tName].id.toString('hex'),
        obj[this.tName].street_num,
        obj[this.tName].street_name,
        obj[this.tName].locality,
        obj[this.tName].district,
      );
    }

    return null;
  }
}
