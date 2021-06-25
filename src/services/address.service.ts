import { Injectable } from '@nestjs/common';
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

  async findById(id: Buffer) : Promise<Address | undefined> {
    return this.getFullObjectQuery()
      .where('address.id = :id', { id })
      .getOne();
  }

  async save(address: DeepPartial<Address>) : Promise<Address> {
    return this.repo.save(address);
  }

  private getFullObjectQuery(): SelectQueryBuilder<Address> {
    return this.repo.createQueryBuilder('Address')
      .leftJoinAndMapOne('address.zipcode', 'address.zipcode', 'zipcode')
      .leftJoinAndMapOne('zipcode.city', 'zipcode.city', 'city')
      .leftJoinAndMapOne('city.department', 'city.department', 'department');
  }
}
