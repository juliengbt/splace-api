import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import ParseBase64IDPipe from 'src/pipes/parse-base64id.pipe';
import Equipment from '../equipment/entities/equipment.entity';
import User from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiTags('User')
  @ApiOkResponse({ type: User })
  @HttpCode(HttpStatus.OK)
  async me(@GetCurrentUserId() userId: Buffer): Promise<User> {
    const user = await this.service.findById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    return user;
  }

  @Post('/saveEquipment/:id')
  @ApiTags('SavedEquipment')
  @ApiOkResponse()
  @ApiParam({ type: String, name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async saveEquipment(
    @Param('id', new ParseBase64IDPipe()) equipmentId: Buffer,
    @GetCurrentUserId() userId: Buffer
  ): Promise<void> {
    await this.service.updateFavorite(userId, equipmentId);
  }

  @Get('/savedEquipments')
  @ApiOkResponse({ type: Equipment, isArray: true })
  @ApiTags('SavedEquipment')
  @HttpCode(HttpStatus.OK)
  async getSavedEquipments(@GetCurrentUserId() userId: Buffer): Promise<Equipment[]> {
    return this.service.getSavedEquipments(userId);
  }
}
