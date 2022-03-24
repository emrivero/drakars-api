import { AutoMap } from '@automapper/classes';
import { IsEnum, IsString } from 'class-validator';
import { Role } from '../../../domain/types/role';

export class UpdateUserDto {
  @AutoMap()
  @IsString()
  username?: string;

  @IsString()
  @AutoMap()
  email?: string;

  @IsString()
  @AutoMap()
  firstName?: string;

  @IsString()
  @AutoMap()
  lastName?: string;

  @IsEnum(Role)
  @AutoMap()
  role: Role;
}
