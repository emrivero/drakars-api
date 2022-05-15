import { ClientDto } from '../../infrastructure/rest/dtos/client.dto';
import { Role } from '../types/role';
import { User } from './user';

export class Client extends User {
  private constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    family_name: string,
    email: string,
    public readonly dni: string,
    role: Role,
    preferred_username?: string,
    given_name?: string,
    password?: string,
  ) {
    super(
      id,
      createdAt,
      updatedAt,
      name,
      preferred_username,
      given_name,
      family_name,
      email,
      role,
      password,
    );
  }

  static fromDto(dto: ClientDto) {
    return new Client(
      null,
      null,
      null,
      dto.name,
      dto.family_name,
      dto.email,
      dto.dni,
      Role.CLIENT,
      dto.preferred_username,
      dto.given_name,
      dto.password,
    );
  }
}
