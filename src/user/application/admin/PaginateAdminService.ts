import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { ClientEntity } from '../../../client/infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../../../client/infrastructure/persistence/repository/client.repository';
import { paginate, PaginateConfig, PaginateQuery } from '../../../lib/paginate';
import { AdminEntity } from '../../infrastructure/persistence/entity/admin.entity';
import { EditorEntity } from '../../infrastructure/persistence/entity/editor.entity';
import { AdminRepository } from '../../infrastructure/persistence/repository/admin.repository';
import { EditorRepository } from '../../infrastructure/persistence/repository/editor.repository';

@Injectable()
export class PaginateAdminService {
  static PAGINATE_ADMIN_CONFIGURATION: PaginateConfig<AdminEntity> = {
    sortableColumns: ['id'],
    searchableColumns: ['family_name', 'email', 'name'],
    defaultLimit: 10,
    maxLimit: 50,
    defaultSortBy: [['id', 'ASC']],
  };
  static PAGINATE_EDITOR_CONFIGURATION: PaginateConfig<EditorEntity> = {
    sortableColumns: ['id'],
    searchableColumns: ['family_name', 'email', 'name'],
    defaultLimit: 10,
    maxLimit: 50,
    defaultSortBy: [['id', 'ASC']],
    relations: ['office'],
  };
  static PAGINATE_CLIENT_CONFIGURATION: PaginateConfig<ClientEntity> = {
    sortableColumns: ['id'],
    searchableColumns: ['family_name', 'email', 'name', 'dni'],
    defaultLimit: 10,
    maxLimit: 50,
    defaultSortBy: [['id', 'ASC']],
  };
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly editorRepository: EditorRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async paginateAdmin(query: PaginateQuery, email: string) {
    return paginate(query, this.adminRepository, {
      ...PaginateAdminService.PAGINATE_ADMIN_CONFIGURATION,
      where: {
        email: Not(email),
      },
    });
  }

  async paginateEditor(query: PaginateQuery, email: string) {
    return paginate(query, this.editorRepository, {
      ...PaginateAdminService.PAGINATE_EDITOR_CONFIGURATION,
      where: {
        email: Not(email),
      },
    });
  }
  async paginateClient(query: PaginateQuery) {
    return paginate(query, this.clientRepository, {
      ...PaginateAdminService.PAGINATE_CLIENT_CONFIGURATION,
    });
  }
}
