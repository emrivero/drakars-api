import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { CityRepository } from '../../infrastructure/persistence/repository/city.mariadb,repository';

@Injectable()
export class SearchCityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async search(name: string) {
    return await this.cityRepository.find({
      name: Like(`${name}%`),
    });
  }
}
