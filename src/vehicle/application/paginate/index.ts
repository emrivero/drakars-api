import { Injectable } from '@nestjs/common';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from '../../../lib/paginate';

import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb.repository';

@Injectable()
export class PaginateVehicleService {
  static PAGINATE_CONFIGURATION: PaginateConfig<VehicleEntity> = {
    sortableColumns: ['id', 'year', 'pricePerDay'],
    searchableColumns: [
      'id',
      'fullName',
      'office.name',
      'office.municipality.name',
      'office.municipality.city.name',
    ],
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
    relations: ['image'],
    deepRelations: [
      {
        office: {
          municipality: 'city',
        },
      },
    ],
  };
  constructor(private readonly vehicleRepository: VehicleMariadbRepository) {}

  async paginate(
    query: PaginateQuery & {
      relations: ('rents' | 'office' | 'ratings')[];
      paginateOptions: PaginateConfig<VehicleEntity>;
    },
  ) {
    const { paginateOptions } = query;
    return paginate(query, this.vehicleRepository, {
      ...PaginateVehicleService.PAGINATE_CONFIGURATION,
      ...paginateOptions,
    });
  }
}
