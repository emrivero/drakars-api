import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { KeycloakConfigModule } from '../config/keycloak/config.module';
import { KeycloakConfigService } from '../config/keycloak/config.service';
import { VehicleRatingEntity } from '../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { CreateClientService } from './application/create/CreateUserService';
import { DeleteClientService } from './application/delete';
import { GetClientService } from './application/find';
import { FindOrCreateClientService } from './application/find-or-create';
import { UpdateClientService } from './application/update';
import { KeycloakConnector } from './infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakRepository } from './infrastructure/idp/keycloak/repositories/keycloak.repository';
import { ClientEntity } from './infrastructure/persistence/entity/client.entity';
import { ClientRepository } from './infrastructure/persistence/repository/client.repository';
import { ClientController } from './infrastructure/rest/controllers/client.controller';

@Module({
  imports: [
    CqrsModule,
    KeycloakConfigModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    TypeOrmModule.forFeature([
      ClientEntity,
      ClientRepository,
      VehicleRatingEntity,
    ]),
  ],
  controllers: [ClientController],
  providers: [
    CreateClientService,
    DeleteClientService,
    GetClientService,
    KeycloakConfigService,
    KeycloakConnector,
    KeycloakRepository,
    UpdateClientService,
    FindOrCreateClientService,
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
export class ClientModule {}
