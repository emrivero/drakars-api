import { Injectable } from '@nestjs/common';
import { Client } from '../../../domain/entities/client';
import { ClientRepository } from '../../../infrastructure/persistence/repository/client.repository';

@Injectable()
export class DeleteClientService {
  constructor(
    private readonly clientRepository: ClientRepository, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async delete(client: Client) {
    return this.clientRepository.delete({ email: client.email });
  }
}
