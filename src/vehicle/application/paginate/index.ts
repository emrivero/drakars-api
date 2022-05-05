import { Injectable } from '@nestjs/common';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from 'nestjs-paginate';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { VehicleMariadbRepository } from '../../infrastructure/persistence/repositories/vehicle.mariadb,repository';

@Injectable()
export class PaginateVehicleService {
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
    relations: ['office'],
  };
  constructor(private readonly vehicleRepository: VehicleMariadbRepository) {}

  async paginate(
    query: PaginateQuery & { relations: ('rents' | 'office' | 'ratings')[] },
  ) {
    return paginate(query, this.vehicleRepository, {
      ...PaginateVehicleService.PAGINATE_CONFIGURATION,
    });
  }
}
