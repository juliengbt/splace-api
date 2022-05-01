import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import BaseUser from './baseUser.entity';
import { BaseUserService } from './baseUser.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: BaseUserService) {}

  @Get()
  @ApiResponse({ type: BaseUser })
  async getUser(@GetCurrentUserId() userId: Buffer): Promise<BaseUser> {
    const user = await this.service.findById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    return user;
  }
}
