import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from '../config/keycloak/config.module';
import { KeycloakConfigService } from '../config/keycloak/config.service';
import { VehicleRatingEntity } from '../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { KeycloakConnector } from './infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakRepository } from './infrastructure/idp/keycloak/repositories/keycloak.repository';
import { AdminEntity } from './infrastructure/persistence/entity/admin.entity';
import { EditorEntity } from './infrastructure/persistence/entity/editor.entity';
import { AdminRepository } from './infrastructure/persistence/repository/admin.repository';
import { EditorRepository } from './infrastructure/persistence/repository/editor.repository';
import { AdminController } from './infrastructure/rest/controllers/admin.controller';
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
      EditorRepository,
      AdminRepository,
      VehicleRatingEntity,
    ]),
  ],
  controllers: [EditorController, AdminController],
  providers: [
    KeycloakConfigService,
    KeycloakConnector,
    KeycloakRepository,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
})
export class UserModule {}
