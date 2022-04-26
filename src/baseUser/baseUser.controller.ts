import { Body, ConflictException, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local-auth.gards';
import BaseUser from './baseUser.entity';
import { BaseUserService } from './baseUser.service';
import BaseUserCreate from './dto/baseUser.create';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: BaseUserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return req.user;
  }

  @Post('add')
  @ApiBody({ type: BaseUserCreate })
  @ApiConflictResponse({ description: 'User email already exists' })
  async addUser(@Body() user: BaseUserCreate): Promise<BaseUser> {
    const exists = await this.service.findByEmail(user.email);

    if (exists)
      throw new ConflictException(undefined, `User already exists with email: ${user.email}`);

    return this.service.create(user);
  }
}
