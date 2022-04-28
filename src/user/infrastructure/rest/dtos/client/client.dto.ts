import { IsEmail, IsString, Length } from 'class-validator';

export class ClientDto {
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

  @IsString()
  @Length(8, 20)
  password: string;
}
