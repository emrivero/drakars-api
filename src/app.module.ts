import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { join } from 'path';
import { AppController } from './app.controller';
import { CityModule } from './city/city.module';
import { MariaDBConfigModule } from './config/databases/mariadb/config.module';
import { MariaDBConfigService } from './config/databases/mariadb/config.service';
import { KeycloakConfigModule } from './config/keycloak/config.module';
import { KeycloakConfigService } from './config/keycloak/config.service';
import { InvoiceModule } from './invoice/invoice.module';
import { OfficeModule } from './office/office.module';
import { RentModule } from './rent/rent.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public', 'resources'),
      exclude: ['/api/*'],
    }),
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [MariaDBConfigModule],
      useExisting: MariaDBConfigService,
    }),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'classMapper', pluginInitializer: classes }],
      singular: true,
      globalNamingConventions: {
        source: new CamelCaseNamingConvention(),
        destination: new CamelCaseNamingConvention(),
      },
    }),
    UserModule,
    VehicleModule,
    RentModule,
    CityModule,
    OfficeModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
