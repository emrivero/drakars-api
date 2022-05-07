import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { MunicipalityRepository } from '../../../infrastructure/persistence/repository/municipality.mariadb.repository';

@Injectable()
export class SearchMunicipalityService {
  constructor(private readonly municipalityService: MunicipalityRepository) {}

  async search(cityId: number, name: string) {
    return await this.municipalityService.find({
      name: Like(`${name}%`),
      city: { id: cityId },
    });
  }
}
