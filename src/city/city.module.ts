import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchMunicipalityService } from './application/municipality/search';
import { SearchCityService } from './application/search';
import { CityEntity } from './infrastructure/persistence/entity/city.entity';
import { MunicipalityEntity } from './infrastructure/persistence/entity/municipality.entity';
import { CityRepository } from './infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from './infrastructure/persistence/repository/municipality.mariadb.repository';
import { CityController } from './infrastructure/rest/city.controller';
import { MunicipalityController } from './infrastructure/rest/municipality.controller';
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
  providers: [SearchCityService, SearchMunicipalityService],
  controllers: [CityController, MunicipalityController],
})
export class CityModule {}
