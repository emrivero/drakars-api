import { BadRequestException, Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../../office/infrastructure/persistence/repository/office.mariadb.repository';
import { Vehicle } from '../../domain/models/vehicle';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { VehicleImageRepository } from '../../infrastructure/persistence/repositories/vehicle-images.repository';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb.repository';

@Injectable()
export class UpdateVehicleService {
  constructor(
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly officeRepository: OfficeRepository,
    private readonly vehicleImageRepository: VehicleImageRepository,
  ) {}
  public async update(id: number, vehicle: Vehicle, imageId: number) {
    const officeEntity = await this.officeRepository.findOne(
      vehicle?.office?.id,
    );
    if (!officeEntity) {
      throw new BadRequestException(
        `Office with id=${vehicle?.office?.id} does not exist`,
      );
    }

    const image = this.vehicleImageRepository.create({ id: imageId });

    const vehicleEntity = vehicle.toEntity(VehicleEntity);
    vehicleEntity.id = id;
    vehicleEntity.image = image;
    return this.vehicleRepository.update(id, vehicleEntity);
  }
}
