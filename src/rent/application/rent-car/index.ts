import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { MoreThan, Not } from 'typeorm';
import { FindOrCreateClientService } from '../../../client/application/find-or-create';
import { Client } from '../../../client/domain/entities/client';
import { Role } from '../../../client/domain/types/role';
import { PaymentStatus } from '../../../invoice/domain/types/invoice-status';
import { OfficeEntity } from '../../../office/infrastructure/persistence/entity/office.entity';
import { GetVehicleService } from '../../../vehicle/application/get-vehicle-by-id';
import { VehicleMariadbRepository } from '../../../vehicle/infrastructure/persistence/repositories/vehicle.mariadb,repository';
import { DateInterval } from '../../domain/DateInterval';
import { RentEntity } from '../../infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';
import { RentCardDto } from '../../infrastructure/rest/dto/rent-car';
import { UpdateRentCardDto } from '../../infrastructure/rest/dto/update-rent-dto';

@Injectable()
export class RentCarService {
  private readonly VEHICLE_NOT_AVAILABLE_ERROR = new BadRequestException(
    'This vehicle is not available',
  );

  private readonly REGISTERED_USER_EXISTS = new ConflictException(
    'Registered user cannot rent in anonymous mode',
  );

  constructor(
    private readonly rentRepository: RentRepository,
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly findOrCreateService: FindOrCreateClientService,
    private readonly getVehicleService: GetVehicleService,
  ) {}

  async checkExistsRegistered(email: string) {
    if (
      await this.findOrCreateService.checkIfExist({ email, type: 'registered' })
    ) {
      throw this.REGISTERED_USER_EXISTS;
    }
  }

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
    const client = Client.create([
      null,
      null,
      null,
      user.name,
      user.lastName,
      user.email,
      user.dni,
      user.phone,
      Role.CLIENT,
    ]);

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
      status: 'pending',
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
    return createdRent;
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
