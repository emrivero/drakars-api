import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual } from 'typeorm';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';

@Injectable()
export class GetRentServive {
  constructor(private readonly rentRepository: RentRepository) {}

  async find(email: string, reference: string) {
    return this.rentRepository.findOne({
      where: [
        {
          reference,
          renterUser: { email },
          status: 'pending',
          startDate: MoreThanOrEqual(new Date()),
        },
        {
          reference,
          renterUser: { email },
          status: 'checkedin',
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
