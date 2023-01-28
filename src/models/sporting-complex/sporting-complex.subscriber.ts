import { generateUUIDBuffer } from 'src/utils/functions';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import SportingComplex from './sporting-complex.entity';

@EventSubscriber()
export class SportingComplexSubscriber implements EntitySubscriberInterface<SportingComplex> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SportingComplex;
  }

  beforeInsert(event: InsertEvent<SportingComplex>): void {
    event.entity.id = generateUUIDBuffer();
  }
}
