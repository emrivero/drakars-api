import { Injectable } from '@nestjs/common';
import { Role } from '../domain/types/role';
import { UserMariadbRepository } from '../infrastructure/persistence/repository/user.mariadb.repository';

@Injectable()
export class FindUserService {
  constructor(
    private readonly userRepository: UserMariadbRepository, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async getByRole(role: Role) {
    return await this.userRepository.findByRole(role);
  }

  async getByIdAndRole(id: number, role: Role) {
    return await this.userRepository.findOneByRoleAndId(id, role);
  }
}
