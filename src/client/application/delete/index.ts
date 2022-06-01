import { BadRequestException, Injectable } from '@nestjs/common';
import { RentRepository } from '../../../rent/infrastructure/persistence/repository/rent.repository';
import { KeycloakRepository } from '../../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';

@Injectable()
export class DeleteClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly keycloakRepository: KeycloakRepository,
    private readonly rentRepository: RentRepository,
  ) {}

  async delete(id: string, email: string) {
    const user = await this.clientRepository.findOne({
      where: {
        email,
      },
    });
    try {
      await this.keycloakRepository.deleteUser(id);
    } catch (e) {
      console.error(e);
    }
    const rent = await this.rentRepository.find({
      status: 'checkedin',
      renterUser: {
        id,
      },
    });

    if (rent.length > 0) {
      throw new BadRequestException('User has a checked rent in');
    }

    return this.clientRepository.delete(user.id);
  }
}
