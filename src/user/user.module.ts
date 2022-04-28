import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from '../config/keycloak/config.module';
import { KeycloakConfigService } from '../config/keycloak/config.service';
import { VehicleRatingEntity } from '../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { CreateClientService } from './application/client/create/CreateUserService';
import { DeleteClientService } from './application/client/delete';
import { GetClientService } from './application/client/find';
import { UpdateClientService } from './application/client/update';
import { KeycloakConnector } from './infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakRepository } from './infrastructure/idp/keycloak/repositories/keycloak.repository';
import { AdminEntity } from './infrastructure/persistence/entity/admin.entity';
import { ClientEntity } from './infrastructure/persistence/entity/client.entity';
import { EditorEntity } from './infrastructure/persistence/entity/editor.entity';
import { AdminRepository } from './infrastructure/persistence/repository/admin.repository';
import { ClientRepository } from './infrastructure/persistence/repository/client.repository';
import { EditorRepository } from './infrastructure/persistence/repository/editor.repository';
import { AdminController } from './infrastructure/rest/controllers/admin.controller';
import { ClientController } from './infrastructure/rest/controllers/client.controller';
import { EditorController } from './infrastructure/rest/controllers/editor.controller';

@Module({
  imports: [
    CqrsModule,
    KeycloakConfigModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    TypeOrmModule.forFeature([
      EditorEntity,
      AdminEntity,
      ClientEntity,
      ClientRepository,
      EditorRepository,
      AdminRepository,
      VehicleRatingEntity,
    ]),
  ],
  controllers: [ClientController, EditorController, AdminController],
  providers: [
    CreateClientService,
    DeleteClientService,
    GetClientService,
    KeycloakConfigService,
    KeycloakConnector,
    KeycloakRepository,
    UpdateClientService,
  ],
})
export class UserModule {}
