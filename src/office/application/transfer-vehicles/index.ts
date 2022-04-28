import { BadRequestException, Injectable } from '@nestjs/common';
import { VehicleMariadbRepository } from '../../../vehicle/infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class TransferOfficeVehiclesService {
  constructor(
    private readonly officeRepository: OfficeRepository,
    private readonly vehicleRepository: VehicleMariadbRepository,
  ) {}

  static buildNotFoundError(id: number) {
    return `Office with id=${id} not exist`;
  }

  async transfer(oldOfficeId: number, newOfficeId: number) {
    const oldOffice = await this.officeRepository.findOne(oldOfficeId, {
      relations: ['vehicles'],
    });

    if (!oldOffice) {
      throw new BadRequestException(
        TransferOfficeVehiclesService.buildNotFoundError(oldOfficeId),
      );
    }

    const newOffice = await this.officeRepository.findOne(newOfficeId);

    if (!newOffice) {
      throw new BadRequestException(
        TransferOfficeVehiclesService.buildNotFoundError(oldOfficeId),
      );
    }

    const { vehicles } = oldOffice;

    const changeOfficeVehicles = vehicles.map((vehicle) => {
      vehicle.office = newOffice;
      return vehicle;
    });

    return this.vehicleRepository.save(changeOfficeVehicles);
  }
}
