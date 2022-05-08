import { IsNumber, IsString, Matches, ValidateIf } from 'class-validator';

export class CreateOfficeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly zipCode: string;

  @IsNumber()
  readonly municipality: number;

  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  readonly morningOpeningTime: string;

  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  readonly morningClosingTime: string;

  @ValidateIf((dto: CreateOfficeDto) => !!dto.eveningClosingTime)
  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  readonly eveningOpeningTime: string;

  @ValidateIf((dto: CreateOfficeDto) => !!dto.eveningOpeningTime)
  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  readonly eveningClosingTime: string;
}
