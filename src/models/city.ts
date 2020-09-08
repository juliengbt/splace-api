import Department from './department';

export default class City {
  public static tName = 'City';

  id: string;

  name: string;

  zip_code: number;

  department: Department | null | undefined;

  // eslint-disable-next-line max-len
  constructor(id: string, name: string, zip_code: number, department: Department | null | undefined) {
    this.id = id;
    this.name = name;
    this.zip_code = zip_code;
    this.department = department;
  }

  public static fromQuery(obj: any): City | undefined {
    if (obj && this.tName in obj) {
      return new City(
        obj[this.tName].id.toString('hex'),
        obj[this.tName].name,
        obj[this.tName].zip_code,
        obj[this.tName].id_department === null ? null : Department.fromQuery(obj),
      );
    }

    return undefined;
  }
}
