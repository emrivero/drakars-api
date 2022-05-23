import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakAdminConfigModule } from '../config/keycloak-admin/config.module';
import { KeycloakAdminConfigService } from '../config/keycloak-admin/config.service';
import { OfficeEntity } from '../office/infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../office/infrastructure/persistence/repository/office.mariadb.repository';
import { RentEntity } from '../rent/infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../rent/infrastructure/persistence/repository/rent.repository';
import { VehicleRatingEntity } from '../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { CreateUserService } from './application/CreateUserService';
import { DeleteUserService } from './application/DeleteUserService';
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
    KeycloakAdminConfigModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakAdminConfigService,
      imports: [KeycloakAdminConfigModule],
    }),
    TypeOrmModule.forFeature([
      RentRepository,
      RentEntity,
      OfficeRepository,
      OfficeEntity,
      EditorEntity,
      AdminEntity,
      EditorRepository,
      AdminRepository,
      VehicleRatingEntity,
    ]),
  ],
  controllers: [EditorController, AdminController],
  providers: [
    CreateUserService,
    DeleteUserService,
    KeycloakAdminConfigService,
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
