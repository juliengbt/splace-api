import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from 'src/models/category/category.entity';
import CategoryService from 'src/models/category/category.service';
import CategoryController from 'src/models/category/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [TypeOrmModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export default class CategoryModule {}
