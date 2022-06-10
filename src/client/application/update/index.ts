import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';
import { ClientDto } from '../../infrastructure/rest/dtos/client.dto';
import { UpdateClientDto } from '../../infrastructure/rest/dtos/update-client.dto';

import { GetClientService } from '../find';

@Injectable()
export class UpdateClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly getService: GetClientService, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async update(updateClient: UpdateClientDto, loggedClient: ClientDto) {
    const userEntity = await this.getService.findByEmail(loggedClient);
    const { id } = userEntity;
    await this.clientRepository.update(id, { ...updateClient });
    return this.clientRepository.findOne(id);
  }
}
