import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './baseUser.controller';
import BaseUser from './baseUser.entity';
import { BaseUserService } from './baseUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([BaseUser])],
  controllers: [UserController],
  providers: [BaseUserService],
  exports: [BaseUserService]
})
export class BaseUserModule {}
