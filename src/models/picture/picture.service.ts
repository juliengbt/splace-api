import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Picture from 'src/models/picture/picture.entity';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export default class PictureService {
  constructor(
    @InjectRepository(Picture)
    private repo: Repository<Picture>
  ) {}

  async addImages(id: Buffer, files: Express.Multer.File[]): Promise<void> {
    const imgs: QueryDeepPartialEntity<Picture>[] = files.map((f) => ({
      name: f.filename,
      equipment: { id }
    }));
    await this.repo.createQueryBuilder().insert().into(Picture).values(imgs).execute();
  }

  async removeAll(id_e: Buffer, pictures: string[]): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(Picture)
      .where('name IN (:...names)', { names: pictures })
      .andWhere('equipmentId = :id_e', { id_e })
      .execute();
  }
}
