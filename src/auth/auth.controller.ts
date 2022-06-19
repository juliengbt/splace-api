import {
  Post,
  Body,
  ConflictException,
  Controller,
  UseGuards,
  NotFoundException,
  NotAcceptableException,
  Param,
  HttpCode,
  HttpStatus,
  Head,
  Patch
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { UserService } from 'src/models/user/user.service';
import BaseUserSignin from 'src/models/user/dto/baseUser.signin';
import { GetCurrentUser } from 'src/decorators/getCurrentUser';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import { Public } from 'src/decorators/public';
import { AuthService } from './auth.service';
import { Tokens } from './dto/tokens.dto';
import { RtGuard } from './guards/rt.guards';
import { MtGuard } from './guards/mt.guards';
import RegularUserCreate from 'src/models/user/dto/regularUser.create';
import ProUserCreate from 'src/models/user/dto/proUser.create';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService, private readonly userService: UserService) {}

  @Post('signin')
  @Public()
  @ApiBody({ type: BaseUserSignin, required: true })
  @ApiOkResponse({ type: Tokens })
  @HttpCode(HttpStatus.OK)
  async signin(@Body() user: BaseUserSignin): Promise<Tokens> {
    return this.service.signin(user);
  }

  @Post('signup')
  @Public()
  @ApiBody({ type: RegularUserCreate })
  @ApiConflictResponse({ description: 'User email already exists' })
  @ApiCreatedResponse({ type: Tokens })
  async signup(@Body() u: RegularUserCreate): Promise<Tokens> {
    return this.service.signup(u);
  }

  @Post('signupPro')
  @Public()
  @ApiBody({ type: ProUserCreate })
  @ApiConflictResponse({ description: 'User email already exists' })
  @ApiCreatedResponse({ type: Tokens })
  async signupPro(@Body() u: ProUserCreate): Promise<Tokens> {
    return this.service.signup(u);
  }

  @Post('logout')
  @Public()
  @UseGuards(RtGuard)
  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: Buffer,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<boolean> {
    return this.service.logout(userId, refreshToken);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse({ type: Tokens })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: Buffer,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return this.service.refreshTokens(userId, refreshToken);
  }

  @Public()
  @UseGuards(MtGuard)
  @Patch('confirmEmail')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@GetCurrentUserId() userId: Buffer): Promise<void> {
    await this.service.confirmEmail(userId);
  }

  @Public()
  @Head('email/:email')
  @ApiParam({ type: String, name: 'email' })
  @ApiOkResponse()
  async emailExists(@Param('email') email: string): Promise<void> {
    const exist = await this.service.emailExist(email);
    if (!exist) throw new NotFoundException();
  }

  @Post('sendConfirmationEmail')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async sendConfirmationEmail(
    @GetCurrentUserId() userId: Buffer,
    @GetCurrentUser('email') userEmail: string
  ): Promise<void> {
    const user = await this.userService.findBaseUserById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    if (user.is_email_confirmed) new ConflictException('Email is already confirmed');
    if (user.email !== userEmail)
      new NotAcceptableException(
        'Ethe email provided by the token is not the same as the user email'
      );
    return this.service.sendConfirmationMail(user);
  }
}
