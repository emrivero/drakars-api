import { Injectable } from '@nestjs/common';
import { RentRepository } from '../../infrastructure/persistence/repository/rent.repository';
import { GetRentServive } from '../get-rent';

@Injectable()
export class CancelRentService {
  constructor(
    private readonly rentRepository: RentRepository,
    private readonly getRentService: GetRentServive,
  ) {}

  async cancel(dni: string, reference: string) {
    const rentData = await this.getRentService.find(dni, reference);
    return await this.rentRepository.remove(rentData);
  }
}
