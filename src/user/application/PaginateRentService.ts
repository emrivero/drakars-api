import { Injectable } from '@nestjs/common';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from '../../lib/paginate';
import { RentEntity } from '../../rent/infrastructure/persistence/entity/rent.entity';
import { RentRepository } from '../../rent/infrastructure/persistence/repository/rent.repository';

@Injectable()
export class PaginateRentService {
  static PAGINATE_CONFIGURATION: PaginateConfig<RentEntity> = {
    sortableColumns: ['id'],
    searchableColumns: ['reference', 'renterUser.email', 'renterUser.dni'],
    filterableColumns: {
      'originOffice.id': [FilterOperator.EQ],
      'destinyOffice.id': [FilterOperator.EQ],
    },
    defaultLimit: 10,
    maxLimit: 50,
    defaultSortBy: [['endDate', 'DESC']],
    relations: ['renterUser', 'rentedVehicle', 'originOffice', 'destinyOffice'],
  };
  constructor(private readonly rentRepository: RentRepository) {}

  async paginate(query: PaginateQuery, office: number = null) {
    const qb = this.rentRepository
      .createQueryBuilder('rent')
      .leftJoin('rent.originOffice', 'originOffice')
      .leftJoin('rent.destinyOffice', 'destinyOffice');
    if (office) {
      qb.where('originOffice.id = :officeId', { officeId: office }).orWhere(
        'destinyOffice.id = :officeId',
        { officeId: office },
      );
    }
    return paginate(query, qb, {
      ...PaginateRentService.PAGINATE_CONFIGURATION,
    });
  }
}
