import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BaseUser from './baseUser.entity';
import { BaseUserService } from './baseUser.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BaseUser])],
  controllers: [UserController],
  providers: [BaseUserService],
  exports: [BaseUserService]
})
export class BaseUserModule {}
