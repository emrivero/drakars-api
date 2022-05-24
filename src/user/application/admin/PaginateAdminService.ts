import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly editorRepository: EditorRepository,
  ) {}

  async paginateAdmin(query: PaginateQuery) {
    return paginate(query, this.adminRepository, {
      ...PaginateAdminService.PAGINATE_ADMIN_CONFIGURATION,
    });
  }

  async paginateEditor(query: PaginateQuery) {
    return paginate(query, this.editorRepository, {
      ...PaginateAdminService.PAGINATE_EDITOR_CONFIGURATION,
    });
  }
}
