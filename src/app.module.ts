import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import CategoryModule from 'src/models/category/category.module';
import CityModule from 'src/models/city/city.module';
import EquipmentModule from 'src/models/equipment/equipment.module';
import PictureModule from 'src/models/picture/picture.module';
import SportModule from 'src/models/sport/sport.module';
import SportingComplexModule from 'src/models/sporting-complex/sporting-complex.module';
import { UserModule } from 'src/models/user/user.module';
import ZipcodeModule from 'src/models/zipcode/zipcode.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards/at.guards';
import { dataSourceOptions } from './database/data-source';
import AddressModule from './models/address/address.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public')
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'fr',
      loaderOptions: {
        path: join(process.cwd(), 'i18n'),
        watch: true
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver]
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    SportModule,
    CategoryModule,
    AddressModule,
    SportingComplexModule,
    EquipmentModule,
    PictureModule,
    CityModule,
    ZipcodeModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transformOptions: { enableImplicitConversion: true },
        forbidUnknownValues: true,
        whitelist: true,
        transform: true
      })
    }
  ]
})
export default class AppModule {}
