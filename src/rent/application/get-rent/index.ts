import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual } from 'typeorm';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';

@Injectable()
export class GetRentServive {
  constructor(private readonly rentRepository: RentRepository) {}

  async find(reference: string) {
    return this.rentRepository.findOne({
      where: [
        {
          reference,
          status: 'pending',
          startDate: MoreThanOrEqual(new Date()),
        },
        {
          reference,
          status: 'checkedin',
        },
        {
          reference,
          status: 'delayed',
        },
      ],
      relations: [
        'rentedVehicle',
        'renterUser',
        'originOffice',
        'destinyOffice',
        'originOffice.municipality',
        'destinyOffice.municipality',
        'originOffice.municipality.city',
        'destinyOffice.municipality.city',
      ],
    });
  }
}
