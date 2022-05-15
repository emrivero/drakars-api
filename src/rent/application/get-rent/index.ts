import { Injectable } from '@nestjs/common';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';

@Injectable()
export class GetRentServive {
  constructor(private readonly rentRepository: RentRepository) {}

  async find(dni: string, reference: string) {
    return await this.rentRepository.findOne({
      where: {
        reference,
        renterUser: { dni },
      },
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
