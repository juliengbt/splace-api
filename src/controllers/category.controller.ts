import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import Category from 'src/entities/category.entity';
import CategoryService from 'src/services/category.service';

@ApiTags('Category')
@Controller('category')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories list',
    type: Category,
    isArray: true
  })
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
