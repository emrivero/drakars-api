import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateVehicleService } from './application/create-vehicle';
import { VehicleEntity } from './infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from './infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { VehicleController } from './infrastructure/rest/controllers/vehicle.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([VehicleEntity, VehicleMariadbRepository]),
  ],
  controllers: [VehicleController],
  providers: [CreateVehicleService],
})
export class VehicleModule {}
