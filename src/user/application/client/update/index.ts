import { Injectable } from '@nestjs/common';
import { Client } from '../../../domain/entities/client';
import { ClientEntity } from '../../../infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../../../infrastructure/persistence/repository/client.repository';
import { GetClientService } from '../find';

@Injectable()
export class UpdateClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly getService: GetClientService, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async update(updateClient: Client, loggedClient: Client) {
    const userEntity = await this.getService.findByEmail(loggedClient);
    const { id } = userEntity;
    const updateEntity = updateClient.toEntity(ClientEntity);
    return await this.clientRepository.update(id, updateEntity);
  }
}
