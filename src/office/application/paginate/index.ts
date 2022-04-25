import { Injectable } from '@nestjs/common';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { OfficeEntity } from '../../infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class PaginateOfficeService {
  static PAGINATE_CONFIG: PaginateConfig<OfficeEntity> = {
    sortableColumns: ['id', 'name'],
    searchableColumns: ['name', 'zipCode', 'municipality.name'],
    defaultLimit: 10,
    maxLimit: 20,
    defaultSortBy: [['id', 'ASC']],
    relations: ['municipality'],
  };

  static LIST_CONFIG: PaginateConfig<OfficeEntity> = {
    sortableColumns: ['name'],
    searchableColumns: ['name'],
    defaultSortBy: [['name', 'ASC']],
  };
  constructor(private readonly officeRepository: OfficeRepository) {}

  paginate(query: PaginateQuery) {
    return paginate(
      query,
      this.officeRepository,
      PaginateOfficeService.PAGINATE_CONFIG,
    );
  }

  async list(query: PaginateQuery) {
    const officeCount = await this.officeRepository.count();
    return paginate(
      { ...query, limit: officeCount },
      this.officeRepository,
      PaginateOfficeService.LIST_CONFIG,
    );
  }
}
