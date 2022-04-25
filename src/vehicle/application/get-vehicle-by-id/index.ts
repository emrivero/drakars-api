import { Injectable } from '@nestjs/common';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb,repository';

@Injectable()
export class GetVehicleService {
  constructor(private readonly vehicleRepository: VehicleMariadbRepository) {}

  getById(id: number) {
    return this.vehicleRepository.findOne(id, {
      //   relations: ['office', 'rents', 'ratings'],
    });
  }
}
