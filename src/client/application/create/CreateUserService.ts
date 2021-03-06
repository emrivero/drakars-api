import { Injectable } from '@nestjs/common';
import { Client } from '../../domain/entities/client';
import { KeycloakRepository } from '../../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { ClientEntity } from '../../infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';
import { ClientDto } from '../../infrastructure/rest/dtos/client.dto';

@Injectable()
export class CreateClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async create(dto: ClientDto) {
    const exist = (await this.clientRepository.count({ email: dto.email })) > 0;
    if (!exist) {
      const kcClientEntity = await this.keycloakRepository.getUser(dto.sub);
      const client = Client.fromKCEntity(kcClientEntity);
      client.type = 'registered';
      const entity = client.toEntity(ClientEntity);

      return this.clientRepository.save(entity);
    }
    return;
  }
}
