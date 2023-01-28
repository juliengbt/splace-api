import { I18nService } from 'nestjs-i18n';
import { generateUUIDBuffer } from 'src/utils/functions';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import Equipment from '../entities/equipment.entity';

@EventSubscriber()
export class EquipmentSubscriber implements EntitySubscriberInterface<Equipment> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Equipment;
  }

  beforeInsert(event: InsertEvent<Equipment>): void {
    event.entity.id = generateUUIDBuffer();
  }
}
