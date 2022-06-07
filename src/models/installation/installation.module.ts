import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import InstallationController from 'src/models/installation/installation.controller';
import Installation from 'src/models/installation/installation.entity';
import InstallationService from 'src/models/installation/installation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Installation])],
  exports: [InstallationService],
  controllers: [InstallationController],
  providers: [InstallationService]
})
export default class InstallationModule {}
