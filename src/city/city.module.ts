import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './infrastructure/persistence/entity/city.entity';
import { MunicipalityEntity } from './infrastructure/persistence/entity/municipality.entity';
import { InsertCitiesService } from './infrastructure/persistence/migration/insert-cities';
import { CityRepository } from './infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from './infrastructure/persistence/repository/municipality.mariadb.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CityEntity,
      CityRepository,
      MunicipalityEntity,
      MunicipalityRepository,
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [InsertCitiesService],
})
export class CityModule {}
