import { Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../../office/infrastructure/persistence/repository/office.mariadb.repository';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb.repository';

@Injectable()
export class DeleteVehicleService {
  constructor(
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly officeRepository: OfficeRepository,
  ) {}
  public async delete(id: number) {
    return this.vehicleRepository.delete({ id });
  }
}
