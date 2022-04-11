import { Injectable } from '@nestjs/common';
import { CreatedUser } from '../domain/entities/created-user.entity';
import { Role } from '../domain/types/role';
import { KeycloakRepository } from '../infrastructure/idp/keycloak/repositories/keycloak.repository';
import { UserMariadbRepository } from '../infrastructure/persistence/repository/user.mariadb.repository';
import { CreateUserDto } from '../infrastructure/rest/dtos/create-user.dto';
import { LoggedUserDto } from '../infrastructure/rest/dtos/logged-user.dto';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserMariadbRepository,
    private readonly keycloakRepository: KeycloakRepository,
  ) {}

  async create(user: LoggedUserDto) {
    const newUser = CreatedUser.create({
      ...user,
      role: Role.USER,
    });

    this.saveUser(newUser);
  }

  async createEditor(user: CreateUserDto) {
    const newEditor = CreatedUser.create({
      ...user,
      email_verified: false,
    });

    this.saveUser(newEditor);
    this.keycloakRepository.createUser(newEditor);
  }

  private async saveUser(user: CreatedUser) {
    const exists = await this.userRepository.findBy('email', user.email);

    if (!exists) {
      this.userRepository.save(user);
    }
  }
}
