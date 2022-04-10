import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import ZipcodeModule from './modules/zipcode.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public')
    }),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
      retryAttempts: 0,
      logging: ['query', 'error']
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
    CityModule,
    ZipcodeModule
  ],
  controllers: [],
  providers: []
})
export default class AppModule {}
