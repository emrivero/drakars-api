import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeRepository } from '../office/infrastructure/persistence/repository/office.mariadb.repository';
import { CreateVehicleService } from './application/create';
import { DeleteVehicleService } from './application/delete';
import { GetVehicleService } from './application/get-vehicle-by-id';
import { PaginateVehicleService } from './application/paginate';
import { UpdateVehicleService } from './application/update';
import { VehicleRepository } from './domain/repository/vehicle.repository';
import { VehicleRatingEntity } from './infrastructure/persistence/entities/vehicle-rating';
import { VehicleEntity } from './infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from './infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { VehicleController } from './infrastructure/rest/controllers/vehicle.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      VehicleEntity,
      VehicleRatingEntity,
      VehicleMariadbRepository,
      OfficeRepository,
    ]),
  ],
  controllers: [VehicleController],
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
