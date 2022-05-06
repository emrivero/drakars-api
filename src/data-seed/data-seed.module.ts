import { Module } from '@nestjs/common';
import { CityRepository } from '../city/infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from '../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { SeedConfigModule } from '../config/seed/config.module';
import { DataSeedingService } from './data-seed.service';

@Module({
  imports: [SeedConfigModule],
  providers: [DataSeedingService, CityRepository, MunicipalityRepository],
})
export class DataSeedModule {}
