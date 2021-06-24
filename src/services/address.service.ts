import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Address from 'src/entities/address.entity';
import Installation from 'src/entities/installation.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class AddressService {
  constructor(
    @InjectRepository(Address)
    private repo: Repository<Address>,
    @InjectRepository(Installation)
    private repoInstal: Repository<Installation>
  ) {}

  async update(address: DeepPartial<Address>): Promise<Address> {
    return this.repo.save(address);
  }

  async findById(id: Buffer) : Promise<Address | undefined> {
    return this.getFullObjectQuery()
      .where('address.id = :id', { id })
      .getOne();
  }

  async countInstallation(id: Buffer) : Promise<number> {
    return this.repoInstal.count({
      where: {
        address: id
      }
    });
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
