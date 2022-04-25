import { Injectable } from '@nestjs/common';
import { UserMariadbRepository } from '../infrastructure/persistence/repository/user.mariadb.repository';
import { UpdateUserDto } from '../infrastructure/rest/dtos/update-user-dto';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userRepository: UserMariadbRepository, // private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async update(user: UpdateUserDto) {
    return await this.userRepository.update(user.id, user);
  }
}
