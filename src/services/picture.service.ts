import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PictureCU from 'src/dto/cu/picture.cu';
import Picture from 'src/entities/picture.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class PictureService {
  constructor(
    @InjectRepository(Picture)
    private repo: Repository<Picture>
  ) {}

  async removeAll(pictures: PictureCU[]): Promise<number | null | undefined> {
    return this.repo.createQueryBuilder()
      .delete()
      .from(Picture)
      .where('name IN (:...names)', { names: pictures.map((p) => p.name) })
      .execute()
      .then((res) => res.affected);
  }
}
