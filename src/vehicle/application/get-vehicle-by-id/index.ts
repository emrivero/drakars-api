import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from '../../../lib/paginate';
import { RentRepository } from '../../../rent/infrastructure/persistence/repository/rent.repository';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb.repository';
import { AvailableVehicleDto } from '../../infrastructure/rest/dtos/available-vehicle';

@Injectable()
export class GetVehicleService {
  constructor(
    private readonly vehicleRepository: VehicleMariadbRepository,
    private readonly rentRepository: RentRepository,
  ) {}
  static PAGINATE_CONFIGURATION: PaginateConfig<VehicleEntity> = {
    sortableColumns: ['id', 'year', 'pricePerDay'],
    searchableColumns: ['fullName'],
    filterableColumns: {
      fuel: [FilterOperator.EQ],
      type: [FilterOperator.EQ],
      mark: [FilterOperator.EQ],
      pricePerDay: [FilterOperator.GT, FilterOperator.LT, FilterOperator.BTW],
      transmission: [FilterOperator.EQ],
      seats: [FilterOperator.GT],
      'office.id': [FilterOperator.EQ],
    },
    defaultLimit: 5000,
    maxLimit: 5000,
    defaultSortBy: [['id', 'ASC']],
  };

  async isAvailable(query: AvailableVehicleDto, vehicleId: number) {
    const isAvailable = (
      await this.getAvailableQuery(query.office, query.startDate, query.endDate)
    ).andWhere('vehicle.id=:id', { id: vehicleId });
    return (await isAvailable.getCount()) > 0;
  }

  async listAvailable(query: AvailableVehicleDto & PaginateQuery) {
    const queryBuilder = await this.getAvailableQuery(
      query.office,
      query.startDate,
      query.endDate,
    );
    return paginate({ ...query }, queryBuilder, {
      ...GetVehicleService.PAGINATE_CONFIGURATION,
      groupBy: ['mark', 'model'],
    });
  }

  getById(id: number) {
    return this.vehicleRepository.findOne(id, {
      relations: ['office', 'image'],
    });
  }

  private async getAvailableQuery(
    office: number,
    startDate: string,
    endDate: string,
  ) {
    const subquery = this.rentRepository
      .createQueryBuilder('rent')
      .leftJoin('rent.rentedVehicle', 'Vehicle')
      .select('Vehicle.id')
      .where('rent.originOffice = :originOffice', { originOffice: office })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`rent.status != :canceled AND rent.status != :checkedout`, {
            canceled: 'canceled',
            checkedout: 'checkedout',
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'rent.startDate <= :startDate AND rent.endDate >= :startDate',
            {
              startDate,
            },
          )
            .orWhere(
              'rent.startDate <= :endDate AND rent.endDate >= :endDate',
              {
                endDate,
              },
            )
            .orWhere(
              'rent.startDate >= :startDate AND rent.endDate <= :endDate',
              {
                startDate,
                endDate,
              },
            );
        }),
      );

    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle')
      .leftJoinAndSelect('vehicle.image', 'image')
      .where('vehicle.office=:office', { office })
      .andWhere('vehicle.active=:active', { active: true })
      .andWhere(`vehicle.id NOT IN (${subquery.getQuery()})`)
      .setParameters(subquery.getParameters());

    return queryBuilder;
  }
}

// SELECT * FROM drakars.vehicle_entity v where v.officeId = 197 AND v.active = true AND v.id NOT IN

// (SELECT r.rentedVehicleId FROM drakars.rent_entity r
// where ( (r.startDate <='2022-05-10' and  r.endDate >='2022-05-10')  or (r.startDate <='2022-06-30' and  r.endDate >='2022-06-30') or
// (r.startDate >='2022-05-10' and r.endDate <='2022-06-30') )
// and (r.status != 'canceled' and r.status != 'checkedout') and r.originOfficeId = 197);
