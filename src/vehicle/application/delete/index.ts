import { BadRequestException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { OfficeRepository } from '../../../office/infrastructure/persistence/repository/office.mariadb.repository';
import { RentRepository } from '../../../rent/infrastructure/persistence/repository/rent.repository';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb.repository';

@Injectable()
export class DeleteVehicleService {
  constructor(
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly rentRepository: RentRepository,
    private readonly officeRepository: OfficeRepository,
  ) {}
  public async delete(id: number) {
    const rents = await this.rentRepository.find({
      where: {
        rentedVehicle: {
          id,
        },
        status: In(['pending', 'checkedin']),
      },
      relations: ['rentedVehicle'],
    });
    if (rents.length > 0) {
      throw new BadRequestException();
    }
    return this.vehicleRepository.delete({ id });
  }
}
