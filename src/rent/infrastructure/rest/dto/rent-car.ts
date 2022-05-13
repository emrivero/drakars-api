import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { PaymentStatus } from '../../../../invoice/domain/types/invoice-status';
import { PaymentType } from '../../../../invoice/domain/types/payment-type';
import { UserInfo } from './user-info';

export class RentCardDto {
  @IsPositive()
  vehicle: number;

  user: UserInfo;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ValidateIf((dto: RentCardDto) => dto.paymentStatus === PaymentStatus.PAID)
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsOptional()
  @IsDateString()
  paymentDate: string;
}
