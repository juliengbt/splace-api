import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import EquipmentNature from '../entities/nature.entity';

@EventSubscriber()
export class EquipmentNatureSubscriber implements EntitySubscriberInterface<EquipmentNature> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return EquipmentNature;
  }

  afterLoad(entity: EquipmentNature): void {
    entity.label = this.i18n.t(`equipment-nature.${entity.code}`, { defaultValue: '' });
  }
}
