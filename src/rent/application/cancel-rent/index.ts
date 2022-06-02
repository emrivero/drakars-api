import { Injectable } from '@nestjs/common';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';
import { GetRentServive } from '../get-rent';

@Injectable()
export class CancelRentService {
  constructor(
    private readonly rentRepository: RentRepository,
    private readonly getRentService: GetRentServive,
  ) {}

  async cancel(reference: string) {
    const rentData = await this.rentRepository.findOne({
      reference,
      status: 'pending',
    });
    if (!rentData) {
      return;
    }
    rentData.status = 'canceled';
    return await this.rentRepository.save(rentData);
  }
}
