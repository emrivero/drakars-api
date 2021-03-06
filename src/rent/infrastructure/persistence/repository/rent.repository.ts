import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository, In, Repository } from 'typeorm';
import { RentEntity } from '../entity/rent.entity';

@Injectable()
@EntityRepository(RentEntity)
export class RentRepository extends Repository<RentEntity> {
  getRent(email: string) {
    return this.findOne({
      where: {
        renterUser: {
          email: email,
        },
        status: In(['pending', 'checkedin', 'delayed']),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'renterUser',
        'rentedVehicle',
        'rentedVehicle.image',
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
        status: 'checkedout',
      },
      order: {
        createdAt: 'DESC',
      },
      relations: [
        'renterUser',
        'rentedVehicle',
        'rentedVehicle.image',
        'destinyOffice',
        'originOffice',
        'destinyOffice.municipality',
        'originOffice.municipality',
        'destinyOffice.municipality.city',
        'originOffice.municipality.city',
      ],
    });
  }

  getRentAnyFilter(value: string) {
    return this.findOne({
      where: [
        {
          renterUser: {
            email: value,
          },
          status: In(['pending', 'checkedin']),
        },
        {
          renterUser: {
            dni: value,
          },
          status: In(['pending', 'checkedin']),
        },
        {
          reference: value,
          status: In(['pending', 'checkedin']),
        },
      ],
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

  getRentByReference(reference: string) {
    return this.findOne(
      {
        reference,
      },
      {
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
      },
    );
  }

  manageRent(reference: string) {
    return this.findOne({
      where: [
        {
          status: In(['checkedin', 'delayed', 'pending']),
          renterUser: {
            email: reference,
          },
        },
        {
          reference,
          status: In(['checkedin', 'delayed', 'pending']),
        },
      ],
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

  async checkIn(id: string) {
    const rent = await this.findOne({ reference: id });
    if (!rent) {
      throw new NotFoundException();
    }

    rent.status = 'checkedin';
    this.save(rent);
    return rent;
  }

  async checkOut(id: string) {
    const rent = await this.findOne({ reference: id });
    if (!rent) {
      throw new NotFoundException();
    }

    rent.status = 'checkedout';
    this.save(rent);
    return rent;
  }
}
