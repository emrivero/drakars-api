import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CityRepository } from '../city/infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from '../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { SeedConfigService } from '../config/seed/config.service';
import { dataCities } from './data/city';
import { dataMunicipalities } from './data/municipality';

@Injectable()
export class DataSeedingService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(DataSeedingService.name);
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly seedingConfigService: SeedConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (this.seedingConfigService.importClient) {
      await this.importClients();
    }

    if (this.seedingConfigService.importCity) {
      await this.importCities();
    }

    if (this.seedingConfigService.importMunicipality) {
      await this.importMunicipalities();
    }

    if (this.seedingConfigService.importOffice) {
      await this.importMunicipalities();
    }

    if (this.seedingConfigService.importVehicle) {
      await this.importVehicles();
    }
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

  private async importVehicles() {}

  private async importCities() {
    await this.cityRepository.delete({});
    await this.cityRepository.insert(dataCities);
  }

  private async importMunicipalities() {
    await this.municipalityRepository.delete({});
    const savedCities = await this.cityRepository.find();
    const addedCities = dataMunicipalities.map((mun) => {
      const city = savedCities.find((city) => city.code === mun.city_code);
      if (city) {
        mun.city = city;
      }
      return mun;
    });
    this.municipalityRepository.insert(addedCities);
  }

  private async importClients() {}

  private async imporOffices() {}
}
