import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { GetCurrentUser } from 'src/decorators/getCurrentUser';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import { Public } from 'src/decorators/public';
import UserCreate from 'src/models/user/dto/user.create';
import UserSignin from 'src/models/user/dto/user.signin';
import { AuthService } from './auth.service';
import { MtGuard } from './guards/mt.guards';
import { RtGuard } from './guards/rt.guards';
import { refreshTokenCookieOptions, REFRESH_TOKEN_COOKIE } from './strategies/rt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signin')
  @Public()
  @ApiBody({ type: UserSignin, required: true })
  @ApiOkResponse({ type: String })
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() user: UserSignin,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<string> {
    const tokens = await this.service.signin(user);
    res.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshTokenCookieOptions);
    res.header('content-type', 'text/plain; charset=utf-8');
    return tokens.accessToken;
  }

  @Post('signup')
  @Public()
  @ApiBody({ type: UserCreate })
  @ApiCreatedResponse({ type: String })
  async signup(
    @Body() u: UserCreate,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<string> {
    const tokens = await this.service.signup(u);
    res.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshTokenCookieOptions);
    res.header('content-type', 'text/plain; charset=utf-8');
    return tokens.accessToken;
  }

  @Post('logout')
  @Public()
  @UseGuards(RtGuard)
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<void> {
    this.service.logout(userId, refreshToken);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse({ type: String })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<string> {
    const tokens = await this.service.refreshTokens(userId, refreshToken);
    res.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshTokenCookieOptions);
    res.header('content-type', 'text/plain; charset=utf-8');
    return tokens.accessToken;
  }

  @Public()
  @UseGuards(MtGuard)
  @Patch('confirmEmail')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@GetCurrentUserId() userId: string): Promise<void> {
    await this.service.confirmEmail(userId);
  }

  @Post('sendConfirmationEmail')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async sendConfirmationEmail(@GetCurrentUserId() userId: string): Promise<void> {
    return this.service.sendConfirmationMail(userId);
  }
}
