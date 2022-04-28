import { Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class GetOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}

  async getById(id: number) {
    const office = await this.officeRepository.findOne(id);
    return office;
  }
}
