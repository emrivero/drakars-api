import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  family_name: string;

  @Matches(/^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/)
  phone: string;
}
