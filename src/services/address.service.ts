import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Address from 'src/entities/address.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class AddressService {
  constructor(
    @InjectRepository(Address)
    private repo: Repository<Address>
  ) {}

  async update(address: DeepPartial<Address>): Promise<Address> {
    return this.repo.save(address);
  }

  async findById(id: Buffer): Promise<Address | null> {
    return this.getFullObjectQuery().where('Address.id = :id', { id }).getOne();
  }

  async exists(address: DeepPartial<Address>): Promise<Address | null> {
    const query = this.getFullObjectQuery().where('Address.id != :id', { id: address.id });

    if (address.locality)
      query.andWhere('LOWER(TRIM(Address.locality)) = LOWER(TRIM(:locality))', {
        locality: address.locality
      });
    if (address.locality === null) query.andWhere('Address.locality is NULL');

    if (address.district)
      query.andWhere('LOWER(TRIM(Address.district)) = LOWER(TRIM(:district))', {
        district: address.district
      });
    if (address.district === null) query.andWhere('Address.district is NULL');

    if (address.street_name)
      query.andWhere('LOWER(TRIM(Address.street_name)) = LOWER(TRIM(:street_name))', {
        street_name: address.street_name
      });
    if (address.street_name === null) query.andWhere('Address.street_name is NULL');

    if (address.street_num)
      query.andWhere('LOWER(TRIM(Address.street_num)) = LOWER(TRIM(:street_num))', {
        street_num: address.street_num
      });
    if (address.street_num === null) query.andWhere('Address.street_num is NULL');

    if (address.zipcode?.id)
      query.andWhere('Address.zipcode = :id_zipcode', { id_zipcode: address.zipcode.id });

    return query.getOne();
  }

  async save(address: DeepPartial<Address>): Promise<Address> {
    const saved = await this.repo.save(address.id ? address : this.repo.create(address));
    const res = await this.findById(saved.id);
    if (!res) throw new InternalServerErrorException();
    return res;
  }

  async delete(id: Buffer): Promise<number> {
    return this.repo
      .createQueryBuilder('Address')
      .useTransaction(true)
      .delete()
      .from(Address)
      .where('Address.id = :id', { id })
      .execute()
      .then((value) => value.affected || 0);
  }

  private getFullObjectQuery(): SelectQueryBuilder<Address> {
    return this.repo
      .createQueryBuilder('Address')
      .leftJoinAndMapOne('Address.zipcode', 'Address.zipcode', 'zipcode')
      .leftJoinAndMapOne('zipcode.city', 'zipcode.city', 'city')
      .leftJoinAndMapOne('city.department', 'city.department', 'department');
  }
}
