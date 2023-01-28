import { I18nService } from 'nestjs-i18n';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import Category from './category.entity';

@EventSubscriber()
export class CategorySubscriber implements EntitySubscriberInterface<Category> {
  constructor(dataSource: DataSource, public i18n: I18nService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Category;
  }

  afterLoad(entity: Category): void {
    entity.name = this.i18n.t(`category.${entity.code}`, { defaultValue: '' });
  }
}
