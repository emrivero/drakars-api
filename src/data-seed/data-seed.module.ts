import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from 'src/city/infrastructure/persistence/entity/city.entity';
import { MunicipalityEntity } from 'src/city/infrastructure/persistence/entity/municipality.entity';
import { VehicleEntity } from 'src/vehicle/infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from 'src/vehicle/infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { CityRepository } from '../city/infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from '../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { SeedConfigModule } from '../config/seed/config.module';
import { OfficeEntity } from '../office/infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../office/infrastructure/persistence/repository/office.mariadb.repository';
import { DataSeedingService } from './data-seed.service';

@Module({
  imports: [
    SeedConfigModule,
    TypeOrmModule.forFeature([
      CityEntity,
      CityRepository,
      MunicipalityRepository,
      MunicipalityEntity,
      VehicleEntity,
      VehicleMariadbRepository,
      OfficeEntity,
      OfficeRepository,
    ]),
  ],
  providers: [DataSeedingService],
})
export class DataSeedModule {}
