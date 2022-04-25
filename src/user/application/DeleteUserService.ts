import { Injectable } from '@nestjs/common';
import { UserMariadbRepository } from '../infrastructure/persistence/repository/user.mariadb.repository';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly userRepository: UserMariadbRepository, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async deleteUsers(ids: number[]) {
    return await Promise.allSettled(
      ids.map(async (id) => await this.deleteUser(id)),
    );
  }
}
