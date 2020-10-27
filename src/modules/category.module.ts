import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from 'src/entities/category.entity';
import CategoryService from 'src/services/category.service';
import CategoryController from 'src/controllers/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [TypeOrmModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export default class CategoryModule {}
