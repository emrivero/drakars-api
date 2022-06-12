import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/)
  phone: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
