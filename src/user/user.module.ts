import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from '../config/keycloak/config.module';
import { KeycloakConfigService } from '../config/keycloak/config.service';
import { CreateUserCommandHandler } from './application/commands/create/create-user.handler';
import { DeleteUserCommandHandler } from './application/commands/delete/delete-user.handler';
import { UpdateUserCommandHandler } from './application/commands/update/update-user.handler';
import { FindAllUsersQueryHandler } from './application/queries/find-all-users.handler';
import { FindUserByIdQueryHandler } from './application/queries/find-user-by-id.handler';
import { UserMapper } from './application/user.mapper';
import { IDPRepository } from './domain/idp/idp.repository';
import { KeycloakConnector } from './infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakRepository } from './infrastructure/idp/keycloak/repositories/keycloak.repository';
import { UserController } from './infrastructure/rest/controllers/user/user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    CqrsModule,
    KeycloakConfigModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
  ],
  controllers: [UserController],
  providers: [
    CreateUserCommandHandler,
    DeleteUserCommandHandler,
    FindAllUsersQueryHandler,
    FindUserByIdQueryHandler,
    KeycloakConnector,
    KeycloakRepository,
    UpdateUserCommandHandler,
    UserMapper,
    UserService,
    {
      provide: IDPRepository,
      useClass: KeycloakRepository,
    },
  ],
})
export class UserModule {}
