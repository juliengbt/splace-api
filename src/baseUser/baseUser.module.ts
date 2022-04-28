import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BaseUser from './baseUser.entity';
import { BaseUserService } from './baseUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([BaseUser])],
  controllers: [],
  providers: [BaseUserService],
  exports: [BaseUserService]
})
export class BaseUserModule {}
