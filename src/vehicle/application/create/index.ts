import { BadRequestException, Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../../office/infrastructure/persistence/repository/office.mariadb.repository';
import { Vehicle } from '../../domain/models/vehicle';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { VehicleImageRepository } from '../../infrastructure/persistence/repositories/vehicle-images.repository';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb.repository';

@Injectable()
export class CreateVehicleService {
  constructor(
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly officeRepository: OfficeRepository,
    private readonly vehicleImageRepository: VehicleImageRepository,
  ) {}
  public async create(vehicle: Vehicle, office: number, imageId: number) {
    const vehicleImage = this.vehicleImageRepository.create({
      id: imageId,
    });
    const officeEntity = await this.officeRepository.findOne(office);
    if (!officeEntity) {
      throw new BadRequestException(`Office with id=${office} does not exist`);
    }
    const vehicleEntity = vehicle.toEntity(VehicleEntity);
    vehicleEntity.fullName = `${vehicleEntity.mark} ${vehicleEntity.model}`;
    vehicleEntity.office = officeEntity;
    vehicleEntity.image = vehicleImage;
    return this.vehicleRepository.save(vehicleEntity);
  }
}
