import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentModule from '../equipment/equipment.module';
import EquipmentService from '../equipment/equipment.service';
import User from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EquipmentModule],
  controllers: [UserController],
  providers: [UserService, EquipmentService],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}
