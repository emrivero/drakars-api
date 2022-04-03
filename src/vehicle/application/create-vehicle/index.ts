import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/models/vehicle';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb,repository';

@Injectable()
export class CreateVehicleService {
  constructor(private readonly vehicleRepository: VehicleMariadbRepository) {}
  public create(vehicle: Vehicle) {
    return this.vehicleRepository.save(vehicle.toEntity());
  }
}
