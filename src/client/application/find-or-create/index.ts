import { Injectable } from '@nestjs/common';
import { Client } from '../../domain/entities/client';
import { ClientEntity } from '../../infrastructure/persistence/entity/client.entity';
import { ClientRepository } from '../../infrastructure/persistence/repository/client.repository';

@Injectable()
export class FindOrCreateClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async findOrCreate(client: Client) {
    const clientEntity = client.toEntity(ClientEntity);
    const foundEntity = await this.clientRepository.findOneBy(
      'email',
      client.email,
    );

    if (foundEntity) {
      return foundEntity;
    }

    return await this.clientRepository.save(clientEntity);
  }

  async checkIfExist(client: Partial<ClientEntity>) {
    return (await this.clientRepository.count({ ...client })) > 0;
  }
}
