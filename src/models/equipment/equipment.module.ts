import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Equipment from 'src/models/equipment/entities/equipment.entity';
import EquipmentController from 'src/models/equipment/equipment.controller';
import EquipmentService from 'src/models/equipment/equipment.service';
import EquipmentLevel from './entities/level.entity';
import EquipmentNature from './entities/nature.entity';
import EquipmentOwner from './entities/owner.entity';
import EquipmentSurface from './entities/surface.entity';
import EquipmentType from './entities/type.entity';
import { EquipmentLevelSubscriber } from './subscribers/level.subscriber';
import { EquipmentNatureSubscriber } from './subscribers/nature.subscriber';
import { EquipmentOwnerSubscriber } from './subscribers/owner.subscriber';
import { EquipmentSurfaceSubscriber } from './subscribers/surface.subscriber';
import { EquipmentTypeSubscriber } from './subscribers/type.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Equipment,
      EquipmentLevel,
      EquipmentNature,
      EquipmentType,
      EquipmentOwner,
      EquipmentSurface
    ])
  ],
  exports: [TypeOrmModule, EquipmentService],
  controllers: [EquipmentController],
  providers: [
    EquipmentService,
    EquipmentLevelSubscriber,
    EquipmentNatureSubscriber,
    EquipmentOwnerSubscriber,
    EquipmentSurfaceSubscriber,
    EquipmentTypeSubscriber
  ]
})
export default class EquipmentModule {}
