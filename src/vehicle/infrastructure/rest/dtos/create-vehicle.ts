import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { MarkType } from '../../../domain/types/mark.type';
import { TransmissionType } from '../../../domain/types/transmission';
import { VehicleType } from '../../../domain/types/vehicle.type';

export class CreateVehicleDto {
  @IsNumber()
  @IsPositive()
  readonly year: number;

  @IsNotEmpty()
  readonly model: string;

  @IsEnum(MarkType)
  readonly mark: MarkType;

  @IsEnum(TransmissionType)
  readonly transmission: TransmissionType;

  @IsEnum(VehicleType)
  readonly type: VehicleType;

  // readonly limitKM: number;

  @IsNumber()
  readonly office: number;

  @IsNumber()
  readonly seats: number;

  @IsNumber()
  readonly pricePerDay: number;

  @IsNumber()
  readonly doors: number;

  @IsString()
  readonly fuel: string;
}
