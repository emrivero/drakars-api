import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOrCreateClientService } from '../../../user/application/client/find-or-create';
import { Client } from '../../../user/domain/entities/client';
import { GetVehicleService } from '../../../vehicle/application/get-vehicle-by-id';
import { VehicleMariadbRepository } from '../../../vehicle/infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { DateInterval } from '../../domain/DateInterval';
import { RentEntity } from '../../infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';
import { RentCardDto } from '../../infrastructure/rest/dto/rent-car';

@Injectable()
export class RentCarService {
  constructor(
    private readonly rentRepository: RentRepository,
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly findOrCreateService: FindOrCreateClientService,
    private readonly getVehicleService: GetVehicleService,
  ) {}

  async rent(dto: RentCardDto) {
    const { user } = dto;
    const client = Client.fromDto({
      email: user.email,
      family_name: user.lastName,
      name: user.name,
      given_name: '',
      preferred_username: '',
      password: '',
      dni: user.dni,
    });

    const renterUser = await this.findOrCreateService.findOrCreate(client);
    const vehicle = await this.vehicleRepository.findOne(dto.vehicle, {
      relations: ['office'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id=${dto.vehicle}`);
    }

    const rentEntity: RentEntity = {
      paymentDate: dto.paymentDate,
      paymentType: dto.paymentType,
      rentedVehicle: vehicle,
      startDate: dto.startDate,
      endDate: dto.startDate,
      status: dto.paymentStatus,
      renterUser,
      total:
        new DateInterval(dto.startDate, dto.endDate).getDays() *
        vehicle.pricePerDay,
    };

    if (
      !(await this.getVehicleService.isAvailable(
        {
          office: vehicle.office.id,
          startDate: dto.startDate,
          endDate: dto.endDate,
        },
        vehicle.id,
      ))
    ) {
      throw new BadRequestException('This vehicle is not available');
    }
    return await this.rentRepository.save(rentEntity);
  }
}
