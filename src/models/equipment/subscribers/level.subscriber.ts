import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import EquipmentLevel from '../entities/level.entity';

@EventSubscriber()
export class EquipmentLevelSubscriber implements EntitySubscriberInterface<EquipmentLevel> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return EquipmentLevel;
  }

  afterLoad(entity: EquipmentLevel): void {
    entity.label = this.i18n.t(`equipment-level.${entity.code}`, { defaultValue: '' });
  }
}
