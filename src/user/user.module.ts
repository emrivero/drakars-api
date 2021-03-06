import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { DeleteClientService } from '../client/application/delete';
import { KeycloakConnector } from '../client/infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakRepository } from '../client/infrastructure/idp/keycloak/repositories/keycloak.repository';
import { ClientEntity } from '../client/infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../client/infrastructure/persistence/repository/client.repository';
import { KeycloakAdminConfigModule } from '../config/keycloak-admin/config.module';
import { KeycloakAdminConfigService } from '../config/keycloak-admin/config.service';
import { KeycloakConfigService } from '../config/keycloak/config.service';
import { OfficeEntity } from '../office/infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../office/infrastructure/persistence/repository/office.mariadb.repository';
import { CancelRentService } from '../rent/application/cancel-rent';
import { GetRentServive } from '../rent/application/get-rent';
import { RentEntity } from '../rent/infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../rent/infrastructure/persistence/repository/rent.repository';
import { PaginateVehicleService } from '../vehicle/application/paginate';
import { VehicleRatingEntity } from '../vehicle/infrastructure/persistence/entities/vehicle-rating';
import { VehicleEntity } from '../vehicle/infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from '../vehicle/infrastructure/persistence/repositories/vehicle.mariadb.repository';
import { PaginateAdminService } from './application/admin/PaginateAdminService';
import { CreateUserService } from './application/CreateUserService';
import { DeleteUserService } from './application/DeleteUserService';
import { PaginateRentService } from './application/PaginateRentService';
import { RefreshStatusRentService } from './application/RefreshStatusRentService';
import { KeycloakAdminConnector } from './infrastructure/idp/keycloak/keycloak-connector';
import { KeycloakAdminRepository } from './infrastructure/idp/keycloak/repositories/keycloak.repository';
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
      VehicleMariadbRepository,
      VehicleEntity,
      ClientRepository,
      ClientEntity,
    ]),
  ],
  controllers: [EditorController, AdminController],
  providers: [
    CreateUserService,
    DeleteUserService,
    KeycloakAdminConfigService,
    KeycloakAdminConnector,
    KeycloakAdminRepository,
    PaginateAdminService,
    PaginateVehicleService,
    PaginateRentService,
    DeleteClientService,
    KeycloakRepository,
    KeycloakConnector,
    KeycloakConfigService,
    RefreshStatusRentService,
    CancelRentService,
    GetRentServive,
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
