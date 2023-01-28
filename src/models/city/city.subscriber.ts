import { generateUUIDBuffer } from 'src/utils/functions';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import City from './city.entity';

@EventSubscriber()
export class CitySubscriber implements EntitySubscriberInterface<City> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return City;
  }

  beforeInsert(event: InsertEvent<City>): void {
    event.entity.id = generateUUIDBuffer();
  }
}
