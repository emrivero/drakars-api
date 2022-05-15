import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { MoreThan, Not } from 'typeorm';
import { PaymentStatus } from '../../../invoice/domain/types/invoice-status';
import { OfficeEntity } from '../../../office/infrastructure/persistence/entity/office.entity';
import { FindOrCreateClientService } from '../../../user/application/client/find-or-create';
import { Client } from '../../../user/domain/entities/client';
import { GetVehicleService } from '../../../vehicle/application/get-vehicle-by-id';
import { VehicleMariadbRepository } from '../../../vehicle/infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { DateInterval } from '../../domain/DateInterval';
import { RentEntity } from '../../infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';
import { RentCardDto } from '../../infrastructure/rest/dto/rent-car';
import { UpdateRentCardDto } from '../../infrastructure/rest/dto/update-rent-dto';
import { GetRentServive } from '../get-rent';

@Injectable()
export class RentCarService {
  private VEHICLE_NOT_AVAILABLE_ERROR = new BadRequestException(
    'This vehicle is not available',
  );

  constructor(
    private readonly rentRepository: RentRepository,
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly findOrCreateService: FindOrCreateClientService,
    private readonly getRentService: GetRentServive,
    private readonly getVehicleService: GetVehicleService,
  ) {}

  async editRent(dni: string, reference: string, dto: UpdateRentCardDto) {
    const rentEntity = await this.findByReferenceAndDni(dni, reference);
    if (!rentEntity) {
      throw new NotFoundException(
        `Rent with reference ${reference} and ${dni} does not exist`,
      );
    }

    const { rentedVehicle, renterUser } = rentEntity;
    const isExtendable = await this.isExtendable(
      rentedVehicle.id,
      renterUser.id,
      dto.endDate,
    );
    if (!isExtendable) {
      throw this.VEHICLE_NOT_AVAILABLE_ERROR;
    }

    return await this.rentRepository.update(rentEntity.id, {
      endDate: dto.endDate,
      endHour: dto.endHour,
      total: this.calcTotalPrice(
        rentEntity.startDate,
        dto.endDate,
        rentedVehicle.pricePerDay,
      ),
      destinyOffice: { id: dto.destinyOffice },
    });
  }

  async rent(
    dto: RentCardDto,
    originOffice: OfficeEntity,
    destinyOffice: OfficeEntity,
  ) {
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
      paymentDate:
        dto.paymentStatus === PaymentStatus.PAID
          ? moment().format('YYYY-MM-DD')
          : null,
      paymentType: dto.paymentType,
      rentedVehicle: vehicle,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.paymentStatus,
      renterUser,
      originOffice,
      destinyOffice,
      startHour: dto.startHour,
      endHour: dto.endHour,
      total: this.calcTotalPrice(
        dto.startDate,
        dto.endDate,
        vehicle.pricePerDay,
      ),
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
      throw this.VEHICLE_NOT_AVAILABLE_ERROR;
    }
    const createdRent = await this.rentRepository.save(rentEntity);
    return this.getRentService.find(
      createdRent.renterUser.dni,
      createdRent.reference,
    );
  }

  private async isExtendable(
    rentedVehicle: number,
    renterUser: number,
    endDate: string,
  ) {
    return (
      (
        await this.rentRepository.find({
          where: {
            rentedVehicle: { id: rentedVehicle },
            startDate: MoreThan(endDate),
            renterUser: Not(renterUser),
          },
          relations: ['rentedVehicle', 'rentedVehicle.office', 'renterUser'],
        })
      ).length > 0
    );
  }

  private async findByReferenceAndDni(dni: string, reference: string) {
    const rentEntity = await this.rentRepository.findOne({
      where: {
        reference,
        renterUser: {
          dni,
        },
      },
      relations: ['rentedVehicle', 'rentedVehicle.office', 'renterUser'],
    });
    return rentEntity;
  }

  private calcTotalPrice(
    startDate: string,
    endDate: string,
    pricePerDay: number,
  ) {
    return new DateInterval(startDate, endDate).getDays() * pricePerDay;
  }
}
