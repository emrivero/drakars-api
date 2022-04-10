import { Injectable } from '@nestjs/common';
import { CreatedUser } from '../domain/entities/created-user.entity';
import { Role } from '../domain/types/role';
import { UserMariadbRepository } from '../infrastructure/persistence/repository/user.mariadb.repository';
import { LoggedUserDto } from '../infrastructure/rest/dtos/logged-user.dto';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserMariadbRepository) {}

  async create(user: LoggedUserDto) {
    const newUser = CreatedUser.create({
      ...user,
      role: Role.USER,
    });

    const exists = await this.userRepository.findBy('email', newUser.email);

    if (!exists) {
      this.userRepository.save(newUser);
    }
  }
}
