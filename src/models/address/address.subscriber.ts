import { generateUUIDBuffer } from 'src/utils/functions';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import Address from './address.entity';

@EventSubscriber()
export class AddressSubscriber implements EntitySubscriberInterface<Address> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Address;
  }

  beforeInsert(event: InsertEvent<Address>): void {
    event.entity.id = generateUUIDBuffer();
  }
}
