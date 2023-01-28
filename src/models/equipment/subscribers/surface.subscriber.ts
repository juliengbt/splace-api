import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import EquipmentSurface from '../entities/surface.entity';

@EventSubscriber()
export class EquipmentSurfaceSubscriber implements EntitySubscriberInterface<EquipmentSurface> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return EquipmentSurface;
  }

  afterLoad(entity: EquipmentSurface): void {
    entity.label = this.i18n.t(`equipment-surface.${entity.code}`, { defaultValue: '' });
  }
}
