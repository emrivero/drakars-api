import { IsNumber, IsString } from 'class-validator';

export class CreateOfficeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly zipCode: string;

  @IsNumber()
  readonly municipality: number;
}
