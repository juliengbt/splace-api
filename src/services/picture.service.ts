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

  addImages(id: Buffer, files: Express.Multer.File[]) : Promise<number> {
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

  async removeAll(id_e: Buffer, pictures: Picture[]): Promise<number | null | undefined> {
    return this.repo.createQueryBuilder()
      .delete()
      .from(Picture)
      .where('name IN (:...names)', { names: pictures.map((p) => p.name) })
      .andWhere('id_equipment = :id_e', { id_e })
      .execute()
      .then((res) => res.affected);
  }
}
