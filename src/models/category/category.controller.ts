import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import Category from 'src/models/category/category.entity';
import CategoryService from 'src/models/category/category.service';

@ApiTags('Category')
@Controller('category')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'Categories list',
    type: Category,
    isArray: true
  })
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
