import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  ConflictException,
  Controller,
  UseGuards,
  NotFoundException
} from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseUserService } from 'src/baseUser/baseUser.service';
import BaseUserCreate from 'src/baseUser/dto/baseUser.create';
import BaseUserSignin from 'src/baseUser/dto/baseUser.signin';
import { GetCurrentUser } from 'src/decorators/getCurrentUser';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import { Public } from 'src/decorators/public';
import { AuthService } from './auth.service';
import { Tokens } from './dto/tokens.dto';
import { RtGuard } from './guards/rt.guards';
import { MtGuard } from './guards/mt.guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly userService: BaseUserService
  ) {}

  @Post('signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BaseUserSignin, required: true })
  @ApiResponse({ type: Tokens, status: HttpStatus.OK })
  async signin(@Body() user: BaseUserSignin): Promise<Tokens> {
    return this.service.signin(user);
  }

  @Post('signup')
  @Public()
  @ApiBody({ type: BaseUserCreate })
  @HttpCode(HttpStatus.CREATED)
  @ApiConflictResponse({ description: 'User email already exists' })
  @ApiResponse({ type: Tokens, status: HttpStatus.CREATED })
  async signup(@Body() user: BaseUserCreate): Promise<Tokens> {
    const exists = await this.userService.findByEmail(user.email);

    if (exists)
      throw new ConflictException(undefined, `User already exists with email: ${user.email}`);
    return this.service.signup(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: Boolean, status: HttpStatus.OK })
  async logout(@GetCurrentUserId() userId: Buffer): Promise<boolean> {
    return this.service.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: Tokens, status: HttpStatus.OK })
  async refreshTokens(
    @GetCurrentUserId() userId: Buffer,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return this.service.refreshTokens(userId, refreshToken);
  }

  @Public()
  @UseGuards(MtGuard)
  @Post('confirmEmail')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  async confirmEmail(@GetCurrentUserId() userId: Buffer): Promise<void> {
    return this.service.confirmEmail(userId);
  }

  @Post('sendConfirmationEmail')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  async sendConfirmationEmail(@GetCurrentUserId() userId: Buffer): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    if (user.is_email_confirmed) new ConflictException('Email is already confirmed');
    return this.service.sendConfirmationMail(user);
  }
}
