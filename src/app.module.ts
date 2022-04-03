import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { join } from 'path';
import { AppController } from './app.controller';
import { MariaDBConfigModule } from './config/databases/mariadb/config.module';
import { MariaDBConfigService } from './config/databases/mariadb/config.service';
import { KeycloakConfigModule } from './config/keycloak/config.module';
import { KeycloakConfigService } from './config/keycloak/config.service';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'resources'),
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
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}