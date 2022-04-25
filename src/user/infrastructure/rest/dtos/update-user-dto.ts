import { IsEmail, IsEnum, IsNumber, IsString, Length } from 'class-validator';
import { Role } from '../../../domain/types/role';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  preferred_username: string;

  @IsString()
  given_name: string;

  @IsString()
  family_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @Length(8, 20)
  password: string;
}
