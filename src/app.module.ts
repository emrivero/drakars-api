import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { CityModule } from './city/city.module';
import { ClientModule } from './client/client.module';
import { MariaDBConfigModule } from './config/databases/mariadb/config.module';
import { MariaDBConfigService } from './config/databases/mariadb/config.service';
import { DataSeedModule } from './data-seed/data-seed.module';
import { InvoiceModule } from './invoice/invoice.module';
import { OfficeModule } from './office/office.module';
import { RentModule } from './rent/rent.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.zoho.eu',
        port: 587,
        secure: true,
        auth: {
          user: 'info@drakars.es',
          pass: 'txZNUU835EpfeqZ_',
        },
      },
      defaults: {
        from: '"Reserva de Drakars" <no-reply@drakars.es>',
      },
      template: {
        dir: process.cwd() + '/src/public/templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public', 'resources'),
      exclude: ['/api/*', '/static/*'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public', 'static', 'img'),
      exclude: ['/api/*'],
      serveRoot: '/static',
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
    // KeycloakConnectModule.registerAsync({
    //   useExisting: KeycloakConfigService,
    //   imports: [KeycloakConfigModule],
    // }),
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
    DataSeedModule,
    ClientModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
