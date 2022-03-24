import { AutoMap } from '@automapper/classes';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../domain/types/role';

export class CreateUserDto {
  @AutoMap()
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @AutoMap()
  email?: string;

  @IsString()
  @AutoMap()
  firstName?: string;

  @IsString()
  @AutoMap()
  @IsOptional()
  lastName?: string;

  @IsEnum(Role)
  @AutoMap()
  role: Role;

  @IsString()
  @AutoMap()
  password: string;
}
