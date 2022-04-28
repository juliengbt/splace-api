import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import BaseUser from './baseUser.entity';
import { BaseUserService } from './baseUser.service';
import BaseUserCreate from './dto/baseUser.create';
import BaseUserSignin from './dto/baseUser.signin';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: BaseUserService, private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: BaseUserSignin, required: true })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() user: BaseUserSignin) {
    return this.authService.signin(user);
  }

  @Post('signup')
  @ApiBody({ type: BaseUserCreate })
  @HttpCode(HttpStatus.CREATED)
  @ApiConflictResponse({ description: 'User email already exists' })
  async signup(@Body() user: BaseUserCreate): Promise<BaseUser> {
    const exists = await this.service.findByEmail(user.email);

    if (exists)
      throw new ConflictException(undefined, `User already exists with email: ${user.email}`);

    const userId = await this.service.create(user);
    const tokens = await this.authService.getTokens(userId, user.email);
    this.service.updateRefreshToken(userId, tokens.refresh_token);
    const createdUser = await this.service.findById(userId);

    if (!createdUser) throw new InternalServerErrorException();

    return createdUser;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: Buffer) {
    return this.authService.logout(userId);
  }
}
