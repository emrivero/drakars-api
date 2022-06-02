import { Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class DeleteOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}

  async delete(id: number) {
    const office = await this.officeRepository.findOne(id);
    office.deleted = true;

    return this.officeRepository.save(office);
  }
}
