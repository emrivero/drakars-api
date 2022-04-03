import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateVehicleService } from './application/create-vehicle';
import { VehicleRepository } from './domain/repository/vehicle.repository';
import { VehicleEntity } from './infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from './infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { VehicleController } from './infrastructure/rest/controllers/vehicle.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([VehicleEntity, VehicleMariadbRepository]),
  ],
  controllers: [VehicleController],
  providers: [
    CreateVehicleService,
    {
      provide: VehicleRepository,
      useClass: VehicleMariadbRepository,
    },
  ],
})
export class VehicleModule {}
