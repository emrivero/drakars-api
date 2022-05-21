import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { RentEntity } from '../entity/rent.entity';

@Injectable()
@EntityRepository(RentEntity)
export class RentRepository extends Repository<RentEntity> {
  getRent(email: string) {
    return this.findOne({
      where: {
        renterUser: {
          email,
        },
        active: true,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'renterUser',
        'rentedVehicle',
        'destinyOffice',
        'originOffice',
        'destinyOffice.municipality',
        'originOffice.municipality',
        'destinyOffice.municipality.city',
        'originOffice.municipality.city',
      ],
    });
  }

  getOldRents(email: string) {
    return this.find({
      where: {
        renterUser: {
          email,
        },
        active: false,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'renterUser',
        'rentedVehicle',
        'destinyOffice',
        'originOffice',
        'destinyOffice.municipality',
        'originOffice.municipality',
        'destinyOffice.municipality.city',
        'originOffice.municipality.city',
      ],
    });
  }
}
