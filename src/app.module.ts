import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import AddressModule from './models/address/address.module';
import CategoryModule from 'src/models/category/category.module';
import CityModule from 'src/models/city/city.module';
import EquipmentModule from 'src/models/equipment/equipment.module';
import EquipmentLevelModule from 'src/models/equipmentLevel/equipmentLevel.module';
import EquipmentNatureModule from 'src/models/equipmentNature/equipmentNature.module';
import EquipmentTypeModule from 'src/models/equipmentType/equipmentType.module';
import InstallationModule from 'src/models/installation/installation.module';
import OwnerModule from 'src/models/owner/owner.module';
import PictureModule from 'src/models/picture/picture.module';
import SoilTypeModule from 'src/models/soilType/soilType.module';
import SportModule from 'src/models/sport/sport.module';
import ZipcodeModule from 'src/models/zipcode/zipcode.module';
import { UserModule } from 'src/models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards/at.guards';
console.log(__dirname + '/**/*.entity.{js,ts}');
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public')
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: false,
      retryAttempts: 0,
      logging:
        process.env.NODE_ENV === 'production '
          ? ['error']
          : ['error', 'info', 'log', 'query', 'warn']
    }),
    AuthModule,
    UserModule,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export default class AppModule {}
