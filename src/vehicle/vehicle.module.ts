import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakAdminConfigModule } from '../config/keycloak-admin/config.module';
import { KeycloakAdminConfigService } from '../config/keycloak-admin/config.service';
import { OfficeRepository } from '../office/infrastructure/persistence/repository/office.mariadb.repository';
import { RentEntity } from '../rent/infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../rent/infrastructure/persistence/repository/rent.repository';
import { EditorEntity } from '../user/infrastructure/persistence/entity/editor.entity';
import { EditorRepository } from '../user/infrastructure/persistence/repository/editor.repository';
import { CreateVehicleService } from './application/create';
import { DeleteVehicleService } from './application/delete';
import { GetVehicleService } from './application/get-vehicle-by-id';
import { PaginateVehicleService } from './application/paginate';
import { UpdateVehicleService } from './application/update';
import { VehicleRepository } from './domain/repository/vehicle.repository';
import { VehicleImageEntity } from './infrastructure/persistence/entities/vehicle-image';
import { VehicleRatingEntity } from './infrastructure/persistence/entities/vehicle-rating';
import { VehicleEntity } from './infrastructure/persistence/entities/vehicle.entity';
import { VehicleImageRepository } from './infrastructure/persistence/repositories/vehicle-images.repository';
import { VehicleMariadbRepository } from './infrastructure/persistence/repositories/vehicle.mariadb.repository';
import { VehicleImageController } from './infrastructure/rest/controllers/vehicle-images.controller';
import { VehicleController } from './infrastructure/rest/controllers/vehicle.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      VehicleEntity,
      VehicleRatingEntity,
      VehicleMariadbRepository,
      OfficeRepository,
      VehicleImageEntity,
      VehicleImageRepository,
      EditorEntity,
      EditorRepository,
      RentRepository,
      RentEntity,
    ]),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakAdminConfigService,
      imports: [KeycloakAdminConfigModule],
    }),
  ],
  controllers: [VehicleController, VehicleImageController],
  providers: [
    CreateVehicleService,
    PaginateVehicleService,
    GetVehicleService,
    UpdateVehicleService,
    DeleteVehicleService,
    {
      provide: VehicleRepository,
      useClass: VehicleMariadbRepository,
    },
  ],
})
export class VehicleModule {}
