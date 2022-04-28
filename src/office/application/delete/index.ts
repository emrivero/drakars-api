import { BadRequestException, Injectable } from '@nestjs/common';
import { OfficeRepository } from '../../infrastructure/persistence/repository/office.mariadb.repository';

@Injectable()
export class DeleteOfficeService {
  constructor(private readonly officeRepository: OfficeRepository) {}

  async delete(id: number) {
    const officeWithVehicles = await this.officeRepository.findOne(id, {
      relations: ['vehicles'],
    });
    if (officeWithVehicles.vehicles.length > 0) {
      throw new BadRequestException(
        `Office with id=${id} has one or more vehicules. It cannot be deleted.`,
      );
    }
    return this.officeRepository.delete({ id });
  }
}
