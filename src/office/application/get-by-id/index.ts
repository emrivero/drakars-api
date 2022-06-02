import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { HourInterval } from '../../domain/models/hour-interval';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class GetOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}

  async hoursInRange(id: number, start: string) {
    const office = await this.getById(id);

    const {
      morningClosingTime,
      morningOpeningTime,
      eveningClosingTime,
      eveningOpeningTime,
    } = office;
    const morningInterval = new HourInterval(
      morningOpeningTime,
      morningClosingTime,
    );

    const eveningInterval = new HourInterval(
      eveningOpeningTime,
      eveningClosingTime,
    );

    return morningInterval.inRange(start) || eveningInterval.inRange(start);
  }

  async getById(id: number) {
    const office = await this.officeRepository.findOne(id, {
      where: {
        deleted: false,
      },
      relations: ['municipality', 'municipality.city'],
    });
    return office;
  }

  async search(name: string) {
    const offices = await this.officeRepository.find({
      relations: ['municipality', 'municipality.city'],
      where: [
        {
          deleted: false,
          name: Like(`%${name}%`),
        },
        {
          deleted: false,
          municipality: {
            city: {
              name: Like(`${name}%`),
            },
          },
        },
        {
          deleted: false,
          zipCode: Like(`${name}%`),
        },
        {
          deleted: false,
          municipality: {
            name: Like(`${name}%`),
          },
        },
      ],
    });
    return offices;
  }
}
