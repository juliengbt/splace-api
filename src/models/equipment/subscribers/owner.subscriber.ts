import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import EquipmentOwner from '../entities/owner.entity';

@EventSubscriber()
export class EquipmentOwnerSubscriber implements EntitySubscriberInterface<EquipmentOwner> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return EquipmentOwner;
  }

  afterLoad(entity: EquipmentOwner): void {
    entity.label = this.i18n.t(`equipment-owner.${entity.code}`, { defaultValue: '' });
  }
}
