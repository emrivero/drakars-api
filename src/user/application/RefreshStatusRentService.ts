import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { RentRepository } from '../../rent/infrastructure/persistence/repository/rent.repository';

@Injectable()
export class RefreshStatusRentService {
  constructor(private readonly rentRepository: RentRepository) {}

  async refresh() {
    const qb = this.rentRepository.createQueryBuilder('rent');
    const qb2 = this.rentRepository.createQueryBuilder('rent');

    await qb
      .update()
      .set({
        status: 'canceled',
      })
      .where('status = :status ', { status: 'pending' })
      .andWhere('startDate < :today', {
        today: moment().add(2, 'h').format('YYYY-MM-DD'),
      })
      .execute();

    return qb2
      .update()
      .set({
        status: 'delayed',
      })
      .where('status = :status ', { status: 'checkedin' })
      .andWhere('endDate < :today', {
        today: moment().add(2, 'h').format('YYYY-MM-DD'),
      })
      .execute();
  }
}
