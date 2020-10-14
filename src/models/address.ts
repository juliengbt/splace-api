import { UUID } from '../ts/types/uuid';

interface IAddress {
  id?: UUID;

  street_num?: string | null;

  street_name?: string | null;

  locality?: string | null;

  district?: number | null;
}

/**
 * @tsoaModel
 */
class Address {
  public static tName = 'Address';

  id!: UUID;

  street_num: string | null;

  street_name: string | null;

  locality: string | null;

  district: number | null;

  // eslint-disable-next-line max-len
  constructor(id: UUID, street_num: string | null, street_name: string| null, locality: string| null, district: number | null) {
    this.id = id;
    this.street_num = street_num;
    this.street_name = street_name;
    this.locality = locality;
    this.district = district;
  }

  public static fromQuery(obj: any): Address | undefined {
    if (obj && this.tName in obj) {
      return new Address(
        obj[this.tName].id.toString('hex'),
        obj[this.tName].street_num,
        obj[this.tName].street_name,
        obj[this.tName].locality,
        obj[this.tName].district,
      );
    }

    return undefined;
  }
}

export { Address, IAddress };
