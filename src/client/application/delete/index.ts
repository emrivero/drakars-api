import { Injectable } from '@nestjs/common';
import { KeycloakRepository } from '../../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';

@Injectable()
export class DeleteClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async delete(id: string, email: string) {
    const user = await this.clientRepository.findOne({
      where: {
        email,
      },
    });
    await this.keycloakRepository.deleteUser(id);
    return this.clientRepository.delete(user.id);
  }
}
