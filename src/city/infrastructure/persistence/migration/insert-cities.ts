import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CityRepository } from '../repository/city.mariadb,repository';
import { MunicipalityRepository } from '../repository/municipality.mariadb.repository';

@Injectable()
export class InsertCitiesService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(InsertCitiesService.name);
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly municipalityRepository: MunicipalityRepository,
  ) {}

  async onApplicationBootstrap() {
    // await this.municipalityRepository.delete({});
    // await this.cityRepository.delete({});
    // await this.cityRepository.insert(dataCities);
    // const savedCities = await this.cityRepository.find();
    // const addedCities = dataMunicipalities.map((mun) => {
    //   const city = savedCities.find((city) => city.code === mun.city_code);
    //   if (city) {
    //     mun.city = city;
    //   }
    //   return mun;
    // });
    // this.municipalityRepository.insert(addedCities);
    // this.logger.log('Add cities to DB');
  }
}
