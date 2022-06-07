import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import BaseUser from './entities/baseUser.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiResponse({ type: BaseUser })
  async getUser(@GetCurrentUserId() userId: Buffer): Promise<BaseUser> {
    const user = await this.service.findById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    return user;
  }
}
