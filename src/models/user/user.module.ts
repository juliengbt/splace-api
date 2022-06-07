import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BaseUser from './entities/baseUser.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import RegularUser from './entities/regularUser.entity';
import ProUser from './entities/proUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseUser]),
    TypeOrmModule.forFeature([RegularUser]),
    TypeOrmModule.forFeature([ProUser])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
