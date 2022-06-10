import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  family_name: string;

  @ValidateIf((target: UpdateClientDto) => target.phone !== '')
  @Matches(/^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/)
  @IsOptional()
  phone: string;

  @ValidateIf((target: UpdateClientDto) => target.dni !== '')
  @Matches(/[0-9]{8}[A-Za-z]/)
  @IsOptional()
  dni: string;
}
