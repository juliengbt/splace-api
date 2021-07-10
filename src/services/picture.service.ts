import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Picture from 'src/entities/picture.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export default class PictureService {
  constructor(
    @InjectRepository(Picture)
    private repo: Repository<Picture>
  ) {}

  async addImages(id: Buffer, files: Express.Multer.File[]) : Promise<number> {
    const imgs : DeepPartial<Picture>[] = files.map(
      (f) => ({ name: f.filename, equipment: { id } })
    );
    return this.repo.createQueryBuilder()
      .insert()
      .into(Picture)
      .values(imgs)
      .execute()
      .then((res) => res.identifiers.length);
  }

  async removeAll(id_e: Buffer, pictures: string[]): Promise<number | null | undefined> {
    return this.repo.createQueryBuilder()
      .delete()
      .from(Picture)
      .where('name IN (:...names)', { names: pictures })
      .andWhere('id_equipment = :id_e', { id_e })
      .execute()
      .then((res) => res.affected);
  }

  async findImages(equipmentId: Buffer) : Promise<Picture[]> {
    return this.repo.createQueryBuilder('Picture')
      .where('Picture.equipment = :id', { id: equipmentId })
      .getMany();
  }
}
