import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import Sport from './sport.entity';

@EventSubscriber()
export class SportSubscriber implements EntitySubscriberInterface<Sport> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Sport;
  }

  afterLoad(entity: Sport): void {
    entity.name = this.i18n.t(`sport.${entity.code}`, { defaultValue: '' });
  }
}
