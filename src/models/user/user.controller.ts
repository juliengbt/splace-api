import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import { Public } from 'src/decorators/public';
import { Roles } from 'src/decorators/roles.decorator';
import ParseBase64IDPipe from 'src/pipes/parse-base64id.pipe';
import EquipmentService from '../equipment/equipment.service';
import ProUserSearch from './dto/proUser.search';
import { Role } from './entities/baseUser.entity';
import ProUser from './entities/proUser.entity';
import RegularUser from './entities/regularUser.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly equipmentService: EquipmentService
  ) {}

  @Get()
  @ApiOkResponse({
    schema: { oneOf: [{ $ref: getSchemaPath(ProUser) }, { $ref: getSchemaPath(RegularUser) }] }
  })
  async getUser(@GetCurrentUserId() userId: Buffer): Promise<ProUser | RegularUser> {
    const user = await this.service.findById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    return user;
  }

  @Public()
  @Post('/pro')
  @ApiOkResponse({ type: () => ProUser, isArray: true })
  @ApiBody({ type: () => ProUserSearch, required: true })
  @ApiQuery({ name: 'offset', required: false })
  @HttpCode(HttpStatus.OK)
  async findPros(
    @Body() proUserSearch: ProUserSearch,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number
  ): Promise<ProUser[]> {
    return this.service.findProUsers(proUserSearch, offset < 0 ? 0 : offset);
  }

  @Public()
  @Get('/pro/:id')
  @ApiOkResponse({ type: () => ProUser })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  async getProUserDetail(@Param('id', new ParseBase64IDPipe()) id: Buffer): Promise<ProUser> {
    const pro = await this.service.getProDetailById(id);
    if (!pro) throw new NotFoundException();
    return pro;
  }

  @Post('/favorite/:id')
  @ApiOkResponse()
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  async updateFav(
    @Param('id', new ParseBase64IDPipe()) equipmentId: Buffer,
    @GetCurrentUserId() userId: Buffer
  ): Promise<void> {
    const user = await this.service.findBaseUserById(userId);
    const equipment = await this.equipmentService.findById(equipmentId);

    if (!user || !equipment) throw new NotFoundException();

    await this.service.updateFavorite(user, equipment);
  }

  @Post('/pro/members/add')
  @ApiCreatedResponse()
  @ApiBody({ type: String, description: 'base64 identifier' })
  @Roles(Role.PRO)
  async addMember(
    @GetCurrentUserId() userId: Buffer,
    @Body('id', new ParseBase64IDPipe()) regularUserId: Buffer
  ) {
    const pro = await this.service.getProById(userId);
    const regular = await this.service.getRegById(regularUserId);
    if (!pro || !regular) throw new NotFoundException();

    await this.service.addMember(pro, regular);
  }

  @Post('/pro/members/remove')
  @ApiOkResponse()
  @ApiBody({ type: String, description: 'base64 identifier' })
  @Roles(Role.PRO)
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @GetCurrentUserId() userId: Buffer,
    @Body('id', new ParseBase64IDPipe()) regularUserId: Buffer
  ) {
    const pro = await this.service.getProById(userId);
    const regular = await this.service.getRegById(regularUserId);
    if (!pro || !regular) throw new NotFoundException();

    this.service.removeMember(pro, regular);
  }
}
