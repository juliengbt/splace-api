import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import EquipmentType from '../entities/type.entity';

@EventSubscriber()
export class EquipmentTypeSubscriber implements EntitySubscriberInterface<EquipmentType> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return EquipmentType;
  }

  afterLoad(entity: EquipmentType): void {
    entity.label = this.i18n.t(`equipment-type.${entity.code}`, { defaultValue: '' });
  }
}
