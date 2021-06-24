import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import AddressModule from './modules/address.module';
import CategoryModule from './modules/category.module';
import CityModule from './modules/city.module';
import EquipmentModule from './modules/equipment.module';
import EquipmentLevelModule from './modules/equipmentLevel.module';
import EquipmentNatureModule from './modules/equipmentNature.module';
import EquipmentTypeModule from './modules/equipmentType.module';
import InstallationModule from './modules/installation.module';
import OwnerModule from './modules/owner.module';
import PictureModule from './modules/picture.module';
import SoilTypeModule from './modules/soilType.module';
import SportModule from './modules/sport.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
      retryAttempts: 0
    }),
    SportModule,
    CategoryModule,
    AddressModule,
    InstallationModule,
    EquipmentModule,
    PictureModule,
    EquipmentLevelModule,
    EquipmentNatureModule,
    EquipmentTypeModule,
    OwnerModule,
    SoilTypeModule,
    CityModule
  ],
  controllers: [],
  providers: []
})
export default class AppModule {
}
