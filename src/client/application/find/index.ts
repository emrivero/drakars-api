import { Injectable } from '@nestjs/common';
import { paginate, PaginateConfig, PaginateQuery } from '../../../lib/paginate';
import { Client } from '../../domain/entities/client';
import { ClientEntity } from '../../infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';

@Injectable()
export class GetClientService {
  static PAGINATE_OPTIONS: PaginateConfig<ClientEntity> = {
    maxLimit: 20,
    defaultLimit: 10,
    sortableColumns: ['name', 'id', 'email'],
  };

  constructor(
    private readonly clientRepository: ClientRepository, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async findByEmail(client: Client) {
    return this.clientRepository.findOneBy('email', client.email);
  }

  paginate(query: PaginateQuery) {
    return paginate(
      query,
      this.clientRepository,
      GetClientService.PAGINATE_OPTIONS,
    );
  }
}
