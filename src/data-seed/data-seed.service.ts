import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readdirSync } from 'fs';
import { random } from 'lodash';
import { resolve } from 'path';
import { VehicleMariadbRepository } from 'src/vehicle/infrastructure/persistence/repositories/vehicle.mariadb.repository';
import { CityRepository } from '../city/infrastructure/persistence/repository/city.mariadb,repository';
import { MunicipalityRepository } from '../city/infrastructure/persistence/repository/municipality.mariadb.repository';
import { SeedConfigService } from '../config/seed/config.service';
import { OfficeRepository } from '../office/infrastructure/persistence/repository/office.mariadb.repository';
import { VehicleImageEntity } from '../vehicle/infrastructure/persistence/entities/vehicle-image';
import { VehicleImageRepository } from '../vehicle/infrastructure/persistence/repositories/vehicle-images.repository';
import { dataCities } from './data/city';
import { dataMunicipalities } from './data/municipality';
import { VehicleData } from './data/vehicle';

@Injectable()
export class DataSeedingService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(DataSeedingService.name);
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly seedingConfigService: SeedConfigService,
    private readonly officeRepository: OfficeRepository,
    @InjectRepository(VehicleImageEntity)
    private readonly vehicleImageRepository: VehicleImageRepository,
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

  private async importVehicles() {
    const offices = await this.officeRepository.find();
    const vehicles = await this.vehicleRepository.find({
      relations: ['office', 'image'],
    });
    // await this.vehicleRepository.delete({});
    const vehiclesWithOffice: VehicleData[] = vehicles.map((data) => ({
      ...data,
      office: offices[random(0, offices.length)],
      id: null,
    }));
    await this.vehicleRepository.insert(vehiclesWithOffice);
  }

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

  private async importClients() {
    return;
  }

  // private async imporOffices() {}

  private async importVehicleImages() {
    const vehiclesImage = readdirSync(
      resolve(__dirname, '..', 'public', 'static', 'img', 'vehicles'),
    );
    this.vehicleImageRepository.delete({});
    vehiclesImage.forEach((value) => {
      const entity = this.vehicleImageRepository.create({
        name: value.split('.')[0],
        url: `/static/vehicles/${value}`,
      });
      this.vehicleImageRepository.save(entity);
    });
  }
}
