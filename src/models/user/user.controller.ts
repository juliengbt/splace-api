import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserID';
import ProUser from './entities/proUser.entity';
import RegularUser from './entities/regularUser.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOkResponse({
    schema: { oneOf: [{ $ref: getSchemaPath(ProUser) }, { $ref: getSchemaPath(RegularUser) }] }
  })
  async getUser(@GetCurrentUserId() userId: Buffer): Promise<ProUser | RegularUser> {
    const user = await this.service.findById(userId);
    if (!user) throw new NotFoundException('User does not exists');
    return user;
  }
}
