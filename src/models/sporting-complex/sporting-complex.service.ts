import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SportingComplex from 'src/models/sporting-complex/sporting-complex.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export default class SportingComplexService {
  constructor(
    @InjectRepository(SportingComplex)
    private repo: Repository<SportingComplex>
  ) {}

  async findById(id: string): Promise<SportingComplex | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(sportingComplex: DeepPartial<SportingComplex>): Promise<SportingComplex> {
    const res = await this.repo.save(sportingComplex);
    return this.findById(res.id).then((i) => {
      if (!i) throw new InternalServerErrorException();
      return i;
    });
  }

  async countSportingComplexWithAddress(idAddress: Buffer): Promise<number> {
    return this.repo
      .createQueryBuilder('SportingComplex')
      .where('SportingComplex.address = :id', { id: idAddress })
      .getCount();
  }
}
