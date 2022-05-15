import { IsDateString, IsPositive, Matches } from 'class-validator';

export class UpdateRentCardDto {
  @IsPositive()
  destinyOffice: number;

  @IsDateString()
  endDate: string;

  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  endHour: string;
}
