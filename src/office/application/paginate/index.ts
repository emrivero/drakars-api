import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { paginate, PaginateConfig, PaginateQuery } from '../../../lib/paginate';
import { OfficeEntity } from '../../infrastructure/persistence/entity/office.entity';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class PaginateOfficeService {
  static PAGINATE_CONFIG: PaginateConfig<OfficeEntity> = {
    sortableColumns: ['id', 'name'],
    searchableColumns: [
      'name',
      'zipCode',
      'municipality.name',
      'municipality.city.name',
    ],
    defaultLimit: 10,
    maxLimit: 20,
    defaultSortBy: [['id', 'ASC']],
    // relations: ['municipality'],
    deepRelations: [
      {
        municipality: 'city',
      },
    ],
  };

  static LIST_CONFIG: PaginateConfig<OfficeEntity> = {
    sortableColumns: ['name'],
    searchableColumns: ['municipality.name', 'municipality.city.name'],
    defaultSortBy: [['name', 'ASC']],
    relations: ['municipality'],
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
    const filter = query.search ? `${query.search}%` : '%';
    return await this.officeRepository.find({
      relations: ['municipality', 'municipality.city'],
      where: [
        {
          zipCode: Like(filter),
        },
        {
          name: Like(filter),
        },
        {
          municipality: {
            name: Like(filter),
          },
        },
        {
          municipality: {
            city: {
              name: Like(filter),
            },
          },
        },
      ],
    });
  }
}
