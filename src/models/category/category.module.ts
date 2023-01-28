import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from 'src/models/category/category.entity';
import { CategorySubscriber } from './category.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [CategorySubscriber]
})
export default class CategoryModule {}
