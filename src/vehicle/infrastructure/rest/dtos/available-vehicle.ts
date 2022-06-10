import { IsDateString, IsPositive } from 'class-validator';

export class AvailableVehicleDto {
  @IsPositive()
  office: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
