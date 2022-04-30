import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/decorators/getCurrentUser';
import { BaseUserService } from './baseUser.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: BaseUserService) {}

  @Post()
  async getUser(@GetCurrentUser() user: any): Promise<any> {
    console.log(user);
    this.service.findByEmail('oui');
    return user;
  }
}
