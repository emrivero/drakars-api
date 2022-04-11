import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from '../config/keycloak/config.module';
import { KeycloakConfigService } from '../config/keycloak/config.service';
import { CreateUserService } from './application/CreateUserService';
import { KeycloakConnector } from './infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakRepository } from './infrastructure/idp/keycloak/repositories/keycloak.repository';
import { UserEntity } from './infrastructure/persistence/entity/user.entity';
import { UserMariadbRepository } from './infrastructure/persistence/repository/user.mariadb.repository';
import { UserController } from './infrastructure/rest/controllers/user/user.controller';

@Module({
  imports: [
    CqrsModule,
    KeycloakConfigModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    TypeOrmModule.forFeature([UserEntity, UserMariadbRepository]),
  ],
  controllers: [UserController],
  providers: [
    CreateUserService,
    KeycloakRepository,
    KeycloakConnector,
    KeycloakConfigService,
  ],
})
export class UserModule {}
