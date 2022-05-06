import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from 'src/city/city.module';
import { CityEntity } from 'src/city/infrastructure/persistence/entity/city.entity';
import { MunicipalityEntity } from 'src/city/infrastructure/persistence/entity/municipality.entity';
import { VehicleRepository } from 'src/vehicle/domain/repository/vehicle.repository';
import { VehicleEntity } from 'src/vehicle/infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from 'src/vehicle/infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { CityRepository } from '../city/infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from '../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { SeedConfigModule } from '../config/seed/config.module';
import { DataSeedingService } from './data-seed.service';

@Module({
  imports: [SeedConfigModule, TypeOrmModule.forFeature([
    CityEntity, CityRepository, MunicipalityRepository, MunicipalityEntity, VehicleEntity, VehicleMariadbRepository
  ])],
  providers: [DataSeedingService]
})
export class DataSeedModule {}
