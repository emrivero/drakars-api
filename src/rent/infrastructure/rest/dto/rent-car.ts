import {
  IsDateString,
  IsEnum,
  IsPositive,
  Matches,
  ValidateIf,
} from 'class-validator';
import { PaymentStatus } from '../../../../invoice/domain/types/invoice-status';
import { PaymentType } from '../../../../invoice/domain/types/payment-type';
import { UserInfo } from './user-info';

export class RentCardDto {
  @IsPositive()
  vehicle: number;

  @IsPositive()
  originOffice: number;

  @IsPositive()
  destinyOffice: number;

  user: UserInfo;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  startHour: string;

  @Matches(/([0-1][0-9]|2[0-3]):[0-5][0-9]/)
  endHour: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ValidateIf((dto: RentCardDto) => dto.paymentStatus === PaymentStatus.PAID)
  @IsEnum(PaymentType)
  paymentType: PaymentType;
}
