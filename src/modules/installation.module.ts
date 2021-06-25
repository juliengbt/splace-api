import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import InstallationController from 'src/controllers/installation.controller';
import Installation from 'src/entities/installation.entity';
import InstallationService from 'src/services/installation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Installation])],
  exports: [InstallationService],
  controllers: [InstallationController],
  providers: [InstallationService]
})
export default class InstallationModule {}
