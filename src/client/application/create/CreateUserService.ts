import { Injectable } from '@nestjs/common';
import { Client } from '../../domain/entities/client';
import { KeycloakRepository } from '../../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { ClientEntity } from '../../infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';

@Injectable()
export class CreateClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async create(client: Client) {
    const clientEntity = client.toEntity(ClientEntity);

    return this.clientRepository.save(clientEntity);
  }

  // async createEditor(user: CreateUserDto) {
  //   const newEditor = CreatedUser.create({
  //     ...user,
  //     email_verified: false,
  //   });

  //   this.saveUser(newEditor);
  //   this.keycloakRepository.createUser(newEditor);
  // }

  // async getByRole(role: Role) {
  //   return await this.clientRepository.findByRole(role);
  // }

  // private async saveUser(user: CreatedUser) {
  //   const exists = await this.clientRepository.findOneBy('email', user.email);

  //   if (!exists) {
  //     this.clientRepository.save(user);
  //   }
  // }
}
