import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class GetOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}

  async getById(id: number) {
    const office = await this.officeRepository.findOne(id);
    return office;
  }

  async search(name: string) {
    const offices = await this.officeRepository.find({
      relations: ['municipality', 'municipality.city'],
      where: [
        {
          name: Like(`${name}%`),
        },
        {
          municipality: {
            city: {
              name: Like(`${name}%`),
            },
          },
        },
        {
          zipCode: Like(`${name}%`),
        },
      ],
    });
    return offices;
  }
}
